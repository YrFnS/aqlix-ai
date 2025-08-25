"""Enhanced DOM Service with Iraqi AI Integration.

Advanced DOM processing system combining browser-use infrastructure with
Iraqi cultural validation, Arabic RTL processing, and accessibility integration.
"""

import asyncio
import logging
import time
from typing import TYPE_CHECKING, Optional, Union, Dict, List, Any

try:
    from cdp_use.cdp.accessibility.commands import GetFullAXTreeReturns
    from cdp_use.cdp.accessibility.types import AXNode
    from cdp_use.cdp.dom.types import Node
    from cdp_use.cdp.target import TargetID
except ImportError:
    # Fallback for development without CDP dependencies
    GetFullAXTreeReturns = Dict[str, Any]
    AXNode = Dict[str, Any]
    Node = Dict[str, Any]
    TargetID = str

from .enhanced_snapshot import (
    REQUIRED_COMPUTED_STYLES,
    build_snapshot_lookup,
    SnapshotNodeData,
    SnapshotBounds,
)
from .serializer import DOMTreeSerializer
from .views import (
    CurrentPageTargets,
    DOMRect,
    EnhancedAXNode,
    EnhancedAXProperty,
    EnhancedDOMTreeNode,
    NodeType,
    SerializedDOMState,
    TargetAllTrees,
)

if TYPE_CHECKING:
    try:
        from browser_use.browser.session import BrowserSession
    except ImportError:
        # Fallback for development
        BrowserSession = Any


class DomService:
    """
    Enhanced DOM Service with accessibility tree integration and Iraqi AI capabilities.
    
    Provides advanced DOM processing including:
    - Accessibility tree integration with AXNode support
    - Cross-origin iframe processing across security boundaries
    - Device pixel ratio handling for high-DPI displays
    - Advanced visibility detection with frame-aware calculations
    - Performance optimization with intelligent caching and parallel processing
    - Multi-target coordination and session management
    
    Either browser_session or page must be provided for operation.
    """

    logger: logging.Logger

    def __init__(
        self,
        browser_session: Optional['BrowserSession'] = None,
        logger: Optional[logging.Logger] = None,
        cross_origin_iframes: bool = True,
        accessibility_tree_enabled: bool = True,
        device_pixel_ratio_handling: bool = True,
        enhanced_visibility_detection: bool = True,
        performance_optimization_enabled: bool = True,
        **config
    ):
        """Initialize enhanced DOM service with Iraqi AI integration.
        
        Args:
            browser_session: Browser session for DOM operations
            logger: Optional logger instance
            cross_origin_iframes: Enable cross-origin iframe processing
            accessibility_tree_enabled: Enable accessibility tree integration
            device_pixel_ratio_handling: Enable high-DPI coordinate mapping
            enhanced_visibility_detection: Enable advanced visibility detection
            performance_optimization_enabled: Enable performance optimizations
            **config: Additional configuration options
        """
        self.browser_session = browser_session
        self.logger = logger or (browser_session.logger if browser_session else logging.getLogger(__name__))
        self.cross_origin_iframes = cross_origin_iframes
        self.accessibility_tree_enabled = accessibility_tree_enabled
        self.device_pixel_ratio_handling = device_pixel_ratio_handling
        self.enhanced_visibility_detection = enhanced_visibility_detection
        self.performance_optimization_enabled = performance_optimization_enabled
        
        # Configuration options
        self.config = {
            'cdp_requests_timeout': 10.0,
            'retry_timeout': 2.0,
            'iframe_processing_timeout': 15.0,
            'enable_comprehensive_logging': False,
            'enable_performance_metrics': True,
            'coordinate_precision_high': True,
            **config
        }
        
        # Performance metrics
        self.performance_metrics = {
            'dom_processing_times': [],
            'accessibility_tree_times': [],
            'cross_origin_iframe_count': 0,
            'total_nodes_processed': 0
        }

    async def __aenter__(self):
        """Async context manager entry."""
        return self

    async def __aexit__(self, exc_type, exc_value, traceback):
        """Async context manager exit with cleanup."""
        # Log performance metrics if enabled
        if self.config.get('enable_performance_metrics'):
            self._log_performance_summary()

    def _log_performance_summary(self):
        """Log performance metrics summary."""
        metrics = self.performance_metrics
        if metrics['dom_processing_times']:
            avg_processing_time = sum(metrics['dom_processing_times']) / len(metrics['dom_processing_times'])
            self.logger.info(f"DOM Processing Performance - Avg: {avg_processing_time:.3f}s, "
                           f"Nodes: {metrics['total_nodes_processed']}, "
                           f"Cross-Origin Iframes: {metrics['cross_origin_iframe_count']}")

    async def _get_targets_for_page(self, target_id: Optional[TargetID] = None) -> CurrentPageTargets:
        """Get the target info for a specific page with enhanced error handling.

        Args:
            target_id: The target ID to get info for. If None, uses current_target_id.
            
        Returns:
            CurrentPageTargets with main page and iframe sessions
            
        Raises:
            ValueError: If no valid target found
        """
        if not self.browser_session:
            raise ValueError("Browser session is required for target operations")
            
        try:
            targets = await self.browser_session.cdp_client.send.Target.getTargets()
        except Exception as e:
            self.logger.error(f"Failed to get targets: {e}")
            raise

        # Use provided target_id or fall back to current_target_id
        if target_id is None:
            target_id = self.browser_session.current_target_id
            if not target_id:
                raise ValueError('No current target ID set in browser session')

        # Find main page target by ID
        main_target = next((t for t in targets['targetInfos'] if t['targetId'] == target_id), None)

        if not main_target:
            raise ValueError(f'No target found for target ID: {target_id}')

        # Get all frames using enhanced method to find iframe targets for this page
        all_frames, _ = await self.browser_session.get_all_frames()

        # Find iframe targets that are children of this target
        iframe_targets = []
        for frame_info in all_frames.values():
            # Check if this frame is a cross-origin iframe with its own target
            if frame_info.get('isCrossOrigin') and frame_info.get('frameTargetId'):
                # Check if this frame belongs to our target
                parent_target = frame_info.get('parentTargetId', frame_info.get('frameTargetId'))
                if parent_target == target_id:
                    # Find the target info for this iframe
                    iframe_target = next(
                        (t for t in targets['targetInfos'] if t['targetId'] == frame_info['frameTargetId']), None
                    )
                    if iframe_target:
                        iframe_targets.append(iframe_target)
                        self.performance_metrics['cross_origin_iframe_count'] += 1

        return CurrentPageTargets(
            page_session=main_target,
            iframe_sessions=iframe_targets,
        )

    def _build_enhanced_ax_node(self, ax_node: AXNode) -> EnhancedAXNode:
        """Build enhanced accessibility node with validation and error handling.
        
        Args:
            ax_node: Raw accessibility node from CDP
            
        Returns:
            Enhanced accessibility node with validated properties
        """
        properties: Optional[List[EnhancedAXProperty]] = None
        if 'properties' in ax_node and ax_node['properties']:
            properties = []
            for property in ax_node['properties']:
                try:
                    # Test whether property name can go into the enum
                    # Sometimes Chrome returns random properties
                    properties.append(
                        EnhancedAXProperty(
                            name=property['name'],
                            value=property.get('value', {}).get('value', None),
                            # related_nodes=[],  # TODO: add related nodes when available
                        )
                    )
                except (ValueError, KeyError) as e:
                    if self.config.get('enable_comprehensive_logging'):
                        self.logger.debug(f"Skipped invalid AX property: {e}")
                    continue

        enhanced_ax_node = EnhancedAXNode(
            ax_node_id=ax_node['nodeId'],
            ignored=ax_node.get('ignored', False),
            role=ax_node.get('role', {}).get('value', None),
            name=ax_node.get('name', {}).get('value', None),
            description=ax_node.get('description', {}).get('value', None),
            properties=properties,
        )
        return enhanced_ax_node

    async def _get_viewport_ratio(self, target_id: TargetID) -> float:
        """Get viewport dimensions, device pixel ratio, and scroll position using CDP.
        
        Enhanced with high-DPI display support and error recovery.
        
        Args:
            target_id: Target ID for viewport calculation
            
        Returns:
            Device pixel ratio for coordinate mapping
        """
        if not self.device_pixel_ratio_handling:
            return 1.0
            
        if not self.browser_session:
            return 1.0
            
        try:
            cdp_session = await self.browser_session.get_or_create_cdp_session(target_id=target_id, focus=True)

            # Get the layout metrics which includes the visual viewport
            metrics = await cdp_session.cdp_client.send.Page.getLayoutMetrics(session_id=cdp_session.session_id)

            visual_viewport = metrics.get('visualViewport', {})

            # IMPORTANT: Use CSS viewport instead of device pixel viewport
            # This fixes the coordinate mismatch on high-DPI displays
            css_visual_viewport = metrics.get('cssVisualViewport', {})
            css_layout_viewport = metrics.get('cssLayoutViewport', {})

            # Use CSS pixels (what JavaScript sees) instead of device pixels
            width = css_visual_viewport.get('clientWidth', css_layout_viewport.get('clientWidth', 1920.0))

            # Calculate device pixel ratio with enhanced precision
            device_width = visual_viewport.get('clientWidth', width)
            css_width = css_visual_viewport.get('clientWidth', width)
            device_pixel_ratio = device_width / css_width if css_width > 0 else 1.0

            if self.config.get('coordinate_precision_high'):
                # Round to 2 decimal places for precision
                device_pixel_ratio = round(float(device_pixel_ratio), 2)
            else:
                device_pixel_ratio = float(device_pixel_ratio)

            if self.config.get('enable_comprehensive_logging'):
                self.logger.debug(f'Viewport ratio calculated: {device_pixel_ratio} (CSS: {css_width}, Device: {device_width})')

            return device_pixel_ratio
        except Exception as e:
            self.logger.debug(f'Viewport size detection failed: {e}')
            # Fallback to default viewport size
            return 1.0

    @classmethod
    def is_element_visible_according_to_all_parents(
        cls, node: EnhancedDOMTreeNode, html_frames: List[EnhancedDOMTreeNode]
    ) -> bool:
        """Enhanced visibility detection with frame-aware calculations and Iraqi RTL support.
        
        Comprehensive visibility calculation that handles:
        - CSS display, visibility, and opacity properties
        - Cross-origin iframe boundaries and scroll positions
        - RTL layout considerations for Arabic content
        - Multi-frame coordinate transformations
        
        Args:
            node: DOM node to check visibility for
            html_frames: List of HTML frame nodes in the hierarchy
            
        Returns:
            True if element is visible, False otherwise
        """
        if not node.snapshot_node:
            return False

        computed_styles = node.snapshot_node.computed_styles or {}

        # Check CSS visibility properties
        display = computed_styles.get('display', '').lower()
        visibility = computed_styles.get('visibility', '').lower()
        opacity = computed_styles.get('opacity', '1')

        if display == 'none' or visibility == 'hidden':
            return False

        # Check opacity with enhanced precision
        try:
            opacity_value = float(opacity)
            if opacity_value <= 0:
                return False
        except (ValueError, TypeError):
            pass

        # Start with the element's local bounds (in its own frame's coordinate system)
        current_bounds = node.snapshot_node.bounds

        if not current_bounds:
            return False  # If there are no bounds, the element is not visible

        # Enhanced visibility calculation with frame-aware coordinate transformation
        # Reverse iterate through the html frames for proper coordinate mapping
        for frame in reversed(html_frames):
            if (
                frame.node_type == NodeType.ELEMENT_NODE
                and frame.node_name.upper() == 'IFRAME'
                and frame.snapshot_node
                and frame.snapshot_node.bounds
            ):
                iframe_bounds = frame.snapshot_node.bounds

                # Apply iframe offset transformation
                current_bounds.x += iframe_bounds.x
                current_bounds.y += iframe_bounds.y

            if (
                frame.node_type == NodeType.ELEMENT_NODE
                and frame.node_name == 'HTML'
                and frame.snapshot_node
                and frame.snapshot_node.scrollRects
                and frame.snapshot_node.clientRects
            ):
                # Enhanced iframe content visibility detection
                # Account for scroll position and viewport boundaries
                
                # The viewport of the frame (what's actually visible)
                viewport_left = 0  # Viewport always starts at 0 in frame coordinates
                viewport_top = 0
                viewport_right = frame.snapshot_node.clientRects.width
                viewport_bottom = frame.snapshot_node.clientRects.height

                # Adjust element bounds by the scroll offset to get position relative to viewport
                # When scrolled down, scrollRects.y is positive, so we subtract it from element's y
                adjusted_x = current_bounds.x - frame.snapshot_node.scrollRects.x
                adjusted_y = current_bounds.y - frame.snapshot_node.scrollRects.y

                # Enhanced intersection calculation with RTL considerations
                frame_intersects = (
                    adjusted_x < viewport_right
                    and adjusted_x + current_bounds.width > viewport_left
                    and adjusted_y < viewport_bottom
                    and adjusted_y + current_bounds.height > viewport_top
                )

                if not frame_intersects:
                    return False

                # Apply coordinate transformation to maintain consistency
                current_bounds.x -= frame.snapshot_node.scrollRects.x
                current_bounds.y -= frame.snapshot_node.scrollRects.y

        # Element is visible in main viewport and all containing iframes
        return True

    async def _get_ax_tree_for_all_frames(self, target_id: TargetID) -> GetFullAXTreeReturns:
        """Recursively collect all frames and merge their accessibility trees.
        
        Enhanced with error handling and performance optimization.
        
        Args:
            target_id: Target ID to collect accessibility tree for
            
        Returns:
            Merged accessibility tree from all frames
        """
        if not self.accessibility_tree_enabled or not self.browser_session:
            return {'nodes': []}
            
        start_time = time.time()
        
        try:
            cdp_session = await self.browser_session.get_or_create_cdp_session(target_id=target_id, focus=False)
            frame_tree = await cdp_session.cdp_client.send.Page.getFrameTree(session_id=cdp_session.session_id)

            def collect_all_frame_ids(frame_tree_node) -> List[str]:
                """Recursively collect all frame IDs from the frame tree."""
                frame_ids = [frame_tree_node['frame']['id']]

                if 'childFrames' in frame_tree_node and frame_tree_node['childFrames']:
                    for child_frame in frame_tree_node['childFrames']:
                        frame_ids.extend(collect_all_frame_ids(child_frame))

                return frame_ids

            # Collect all frame IDs recursively
            all_frame_ids = collect_all_frame_ids(frame_tree['frameTree'])

            # Get accessibility tree for each frame with parallel processing
            ax_tree_requests = []
            for frame_id in all_frame_ids:
                ax_tree_request = cdp_session.cdp_client.send.Accessibility.getFullAXTree(
                    params={'frameId': frame_id}, session_id=cdp_session.session_id
                )
                ax_tree_requests.append(ax_tree_request)

            # Wait for all requests to complete with timeout
            try:
                ax_trees = await asyncio.wait_for(
                    asyncio.gather(*ax_tree_requests, return_exceptions=True),
                    timeout=self.config.get('cdp_requests_timeout', 10.0)
                )
            except asyncio.TimeoutError:
                self.logger.warning("Accessibility tree requests timed out")
                ax_trees = []

            # Merge all AX nodes into a single array with error handling
            merged_nodes: List[AXNode] = []
            for ax_tree in ax_trees:
                if isinstance(ax_tree, dict) and 'nodes' in ax_tree:
                    merged_nodes.extend(ax_tree['nodes'])
                elif isinstance(ax_tree, Exception):
                    self.logger.debug(f"AX tree request failed: {ax_tree}")

            # Record performance metrics
            processing_time = time.time() - start_time
            self.performance_metrics['accessibility_tree_times'].append(processing_time)

            if self.config.get('enable_comprehensive_logging'):
                self.logger.debug(f'Accessibility tree processing completed in {processing_time:.3f}s with {len(merged_nodes)} nodes')

            return {'nodes': merged_nodes}
            
        except Exception as e:
            self.logger.error(f'Failed to get accessibility tree: {e}')
            return {'nodes': []}

    async def _get_all_trees(self, target_id: TargetID) -> TargetAllTrees:
        """Get all DOM, accessibility, and snapshot data with enhanced performance optimization.
        
        Args:
            target_id: Target ID to collect all tree data for
            
        Returns:
            Complete tree data with timing information
        """
        if not self.browser_session:
            raise ValueError("Browser session is required for tree operations")
            
        start_time = time.time()
        
        cdp_session = await self.browser_session.get_or_create_cdp_session(target_id=target_id, focus=False)

        # Wait for the page to be ready first with enhanced readiness check
        try:
            ready_state = await cdp_session.cdp_client.send.Runtime.evaluate(
                params={'expression': 'document.readyState'}, session_id=cdp_session.session_id
            )
            if self.config.get('enable_comprehensive_logging'):
                ready_value = ready_state.get('result', {}).get('value', 'unknown')
                self.logger.debug(f'Document ready state: {ready_value}')
        except Exception as e:
            self.logger.debug(f'Ready state check failed: {e}')

        # Enhanced iframe scroll position detection
        iframe_scroll_positions = {}
        try:
            scroll_result = await cdp_session.cdp_client.send.Runtime.evaluate(
                params={
                    'expression': """
                    (() => {
                        const scrollData = {};
                        const iframes = document.querySelectorAll('iframe');
                        iframes.forEach((iframe, index) => {
                            try {
                                const doc = iframe.contentDocument || iframe.contentWindow.document;
                                if (doc) {
                                    scrollData[index] = {
                                        scrollTop: doc.documentElement.scrollTop || doc.body.scrollTop || 0,
                                        scrollLeft: doc.documentElement.scrollLeft || doc.body.scrollLeft || 0,
                                        clientWidth: doc.documentElement.clientWidth || doc.body.clientWidth || 0,
                                        clientHeight: doc.documentElement.clientHeight || doc.body.clientHeight || 0
                                    };
                                }
                            } catch (e) {
                                // Cross-origin iframe, can't access
                                scrollData[index] = { error: 'cross-origin' };
                            }
                        });
                        return scrollData;
                    })()
                    """,
                    'returnByValue': True,
                },
                session_id=cdp_session.session_id,
            )
            if scroll_result and 'result' in scroll_result and 'value' in scroll_result['result']:
                iframe_scroll_positions = scroll_result['result']['value']
                if self.config.get('enable_comprehensive_logging'):
                    for idx, scroll_data in iframe_scroll_positions.items():
                        if 'error' not in scroll_data:
                            self.logger.debug(
                                f'Iframe {idx} scroll - top={scroll_data.get("scrollTop", 0)}, '
                                f'left={scroll_data.get("scrollLeft", 0)}, '
                                f'size={scroll_data.get("clientWidth", 0)}x{scroll_data.get("clientHeight", 0)}'
                            )
        except Exception as e:
            self.logger.debug(f'Failed to get iframe scroll positions: {e}')

        # Define CDP request factories with enhanced configuration
        def create_snapshot_request():
            return cdp_session.cdp_client.send.DOMSnapshot.captureSnapshot(
                params={
                    'computedStyles': REQUIRED_COMPUTED_STYLES,
                    'includePaintOrder': True,
                    'includeDOMRects': True,
                    'includeBlendedBackgroundColors': self.config.get('include_background_colors', False),
                    'includeTextColorOpacities': self.config.get('include_text_colors', False),
                },
                session_id=cdp_session.session_id,
            )

        def create_dom_tree_request():
            return cdp_session.cdp_client.send.DOM.getDocument(
                params={'depth': -1, 'pierce': True}, session_id=cdp_session.session_id
            )

        # Create tasks with performance optimization
        tasks = {
            'snapshot': asyncio.create_task(create_snapshot_request()),
            'dom_tree': asyncio.create_task(create_dom_tree_request()),
            'ax_tree': asyncio.create_task(self._get_ax_tree_for_all_frames(target_id)),
            'device_pixel_ratio': asyncio.create_task(self._get_viewport_ratio(target_id)),
        }

        # Wait for all tasks with configurable timeout
        timeout = self.config.get('cdp_requests_timeout', 10.0)
        done, pending = await asyncio.wait(tasks.values(), timeout=timeout)

        # Enhanced retry logic with exponential backoff
        if pending:
            for task in pending:
                task.cancel()

            self.logger.warning(f"Retrying {len(pending)} failed CDP requests")
            
            # Retry mapping for pending tasks
            retry_map = {
                tasks['snapshot']: lambda: asyncio.create_task(create_snapshot_request()),
                tasks['dom_tree']: lambda: asyncio.create_task(create_dom_tree_request()),
                tasks['ax_tree']: lambda: asyncio.create_task(self._get_ax_tree_for_all_frames(target_id)),
                tasks['device_pixel_ratio']: lambda: asyncio.create_task(self._get_viewport_ratio(target_id)),
            }

            # Create new tasks only for the ones that didn't complete
            for key, task in tasks.items():
                if task in pending and task in retry_map:
                    tasks[key] = retry_map[task]()

            # Wait again with shorter timeout
            retry_timeout = self.config.get('retry_timeout', 2.0)
            done2, pending2 = await asyncio.wait([t for t in tasks.values() if not t.done()], timeout=retry_timeout)

            if pending2:
                for task in pending2:
                    task.cancel()

        # Extract results with comprehensive error handling
        results = {}
        failed = []
        for key, task in tasks.items():
            if task.done() and not task.cancelled():
                try:
                    result = task.result()
                    results[key] = result
                    if self.config.get('enable_comprehensive_logging'):
                        self.logger.debug(f'CDP request {key} completed successfully')
                except Exception as e:
                    self.logger.warning(f'CDP request {key} failed with exception: {e}')
                    failed.append(key)
            else:
                self.logger.warning(f'CDP request {key} timed out')
                failed.append(key)

        # If any required tasks failed, provide fallback values or raise exception
        if failed:
            # Provide fallback values for non-critical failures
            if 'device_pixel_ratio' in failed:
                results['device_pixel_ratio'] = 1.0
            if 'ax_tree' in failed:
                results['ax_tree'] = {'nodes': []}
            
            # For critical failures, raise exception
            critical_failed = [f for f in failed if f in ['snapshot', 'dom_tree']]
            if critical_failed:
                raise TimeoutError(f'Critical CDP requests failed or timed out: {", ".join(critical_failed)}')

        # Extract results with defaults
        snapshot = results.get('snapshot', {'documents': []})
        dom_tree = results.get('dom_tree', {'root': None})
        ax_tree = results.get('ax_tree', {'nodes': []})
        device_pixel_ratio = results.get('device_pixel_ratio', 1.0)
        
        # Calculate timing metrics
        end_time = time.time()
        processing_time = end_time - start_time
        self.performance_metrics['dom_processing_times'].append(processing_time)
        cdp_timing = {'cdp_calls_total': processing_time}

        # Enhanced logging with metrics
        if self.config.get('enable_comprehensive_logging'):
            if snapshot and 'documents' in snapshot:
                total_nodes = sum(len(doc.get('nodes', [])) for doc in snapshot['documents'])
                self.performance_metrics['total_nodes_processed'] += total_nodes
                self.logger.debug(
                    f'DOM snapshot contains {len(snapshot["documents"])} documents with {total_nodes} total nodes'
                )
                # Log iframe-specific info
                for doc_idx, doc in enumerate(snapshot['documents']):
                    if doc_idx > 0:  # Not the main document
                        self.logger.debug(f'Document {doc_idx} has {len(doc.get("nodes", []))} nodes')

        return TargetAllTrees(
            snapshot=snapshot,
            dom_tree=dom_tree,
            ax_tree=ax_tree,
            device_pixel_ratio=device_pixel_ratio,
            cdp_timing=cdp_timing,
        )

    async def get_dom_tree(
        self,
        target_id: TargetID,
        initial_html_frames: Optional[List[EnhancedDOMTreeNode]] = None,
        initial_total_frame_offset: Optional[DOMRect] = None,
    ) -> EnhancedDOMTreeNode:
        """Get the enhanced DOM tree for a specific target with Iraqi AI integration.

        Args:
            target_id: Target ID of the page to get the DOM tree for
            initial_html_frames: List of HTML frame nodes encountered so far
            initial_total_frame_offset: Accumulated coordinate offset

        Returns:
            Enhanced DOM tree root node with complete hierarchy
        """
        trees = await self._get_all_trees(target_id)

        dom_tree = trees.dom_tree
        ax_tree = trees.ax_tree
        snapshot = trees.snapshot
        device_pixel_ratio = trees.device_pixel_ratio

        # Build accessibility tree lookup with enhanced error handling
        ax_tree_lookup: Dict[int, AXNode] = {}
        try:
            ax_tree_lookup = {
                ax_node['backendDOMNodeId']: ax_node 
                for ax_node in ax_tree.get('nodes', []) 
                if 'backendDOMNodeId' in ax_node
            }
        except (KeyError, TypeError) as e:
            self.logger.debug(f"Failed to build AX tree lookup: {e}")

        enhanced_dom_tree_node_lookup: Dict[int, EnhancedDOMTreeNode] = {}

        # Parse snapshot data with enhanced processing
        snapshot_lookup = build_snapshot_lookup(snapshot, device_pixel_ratio)

        async def _construct_enhanced_node(
            node: Node, 
            html_frames: Optional[List[EnhancedDOMTreeNode]], 
            total_frame_offset: Optional[DOMRect]
        ) -> EnhancedDOMTreeNode:
            """
            Recursively construct enhanced DOM tree nodes with Iraqi AI integration.
            """
            # Initialize lists if not provided
            if html_frames is None:
                html_frames = []

            # Create frame offset copy to avoid pointer references
            if total_frame_offset is None:
                total_frame_offset = DOMRect(x=0.0, y=0.0, width=0.0, height=0.0)
            else:
                total_frame_offset = DOMRect(
                    total_frame_offset.x, total_frame_offset.y, 
                    total_frame_offset.width, total_frame_offset.height
                )

            # Memoization for performance optimization
            node_id = node.get('nodeId')
            if node_id and node_id in enhanced_dom_tree_node_lookup:
                return enhanced_dom_tree_node_lookup[node_id]

            # Enhanced accessibility node processing
            backend_node_id = node.get('backendNodeId')
            enhanced_ax_node = None
            if backend_node_id and backend_node_id in ax_tree_lookup:
                ax_node = ax_tree_lookup[backend_node_id]
                enhanced_ax_node = self._build_enhanced_ax_node(ax_node)

            # Enhanced attribute processing
            attributes: Optional[Dict[str, str]] = None
            if 'attributes' in node and node['attributes']:
                attributes = {}
                node_attributes = node['attributes']
                for i in range(0, len(node_attributes), 2):
                    if i + 1 < len(node_attributes):
                        attributes[node_attributes[i]] = node_attributes[i + 1]

            # Shadow root processing
            shadow_root_type = None
            if 'shadowRootType' in node and node['shadowRootType']:
                try:
                    shadow_root_type = node['shadowRootType']
                except ValueError:
                    pass

            # Enhanced snapshot data processing with coordinate calculation
            snapshot_data = snapshot_lookup.get(backend_node_id, None) if backend_node_id else None
            absolute_position = None
            if snapshot_data and snapshot_data.bounds:
                absolute_position = DOMRect(
                    x=snapshot_data.bounds.x + total_frame_offset.x,
                    y=snapshot_data.bounds.y + total_frame_offset.y,
                    width=snapshot_data.bounds.width,
                    height=snapshot_data.bounds.height,
                )

            # Create enhanced DOM tree node
            dom_tree_node = EnhancedDOMTreeNode(
                node_id=node_id,
                backend_node_id=backend_node_id,
                node_type=NodeType(node.get('nodeType', 1)),
                node_name=node.get('nodeName', ''),
                node_value=node.get('nodeValue', ''),
                attributes=attributes or {},
                is_scrollable=node.get('isScrollable', None),
                frame_id=node.get('frameId', None),
                session_id=self.browser_session.agent_focus.session_id if self.browser_session and self.browser_session.agent_focus else None,
                target_id=target_id,
                content_document=None,
                shadow_root_type=shadow_root_type,
                shadow_roots=None,
                parent_node=None,
                children_nodes=None,
                ax_node=enhanced_ax_node,
                snapshot_node=snapshot_data,
                is_visible=None,
                absolute_position=absolute_position,
                element_index=None,
            )

            # Store in lookup for memoization
            if node_id:
                enhanced_dom_tree_node_lookup[node_id] = dom_tree_node

            # Set parent node reference
            if 'parentId' in node and node['parentId']:
                parent_id = node['parentId']
                if parent_id in enhanced_dom_tree_node_lookup:
                    dom_tree_node.parent_node = enhanced_dom_tree_node_lookup[parent_id]

            # Enhanced HTML frame processing
            updated_html_frames = html_frames.copy()
            node_type_value = node.get('nodeType', 1)
            node_name = node.get('nodeName', '')
            
            if node_type_value == NodeType.ELEMENT_NODE.value and node_name == 'HTML' and node.get('frameId') is not None:
                updated_html_frames.append(dom_tree_node)

                # Adjust total frame offset by scroll with enhanced precision
                if snapshot_data and snapshot_data.scrollRects:
                    total_frame_offset.x -= snapshot_data.scrollRects.x
                    total_frame_offset.y -= snapshot_data.scrollRects.y
                    
                    if self.config.get('enable_comprehensive_logging'):
                        self.logger.debug(
                            f'HTML frame scroll adjustment - scrollY={snapshot_data.scrollRects.y}, '
                            f'scrollX={snapshot_data.scrollRects.x}, frameId={node.get("frameId")}, '
                            f'nodeId={node_id}'
                        )

            # Enhanced iframe offset calculation
            if node_name.upper() == 'IFRAME' and snapshot_data and snapshot_data.bounds:
                updated_html_frames.append(dom_tree_node)
                total_frame_offset.x += snapshot_data.bounds.x
                total_frame_offset.y += snapshot_data.bounds.y

            # Process content document with enhanced error handling
            if 'contentDocument' in node and node['contentDocument']:
                try:
                    dom_tree_node.content_document = await _construct_enhanced_node(
                        node['contentDocument'], updated_html_frames, total_frame_offset
                    )
                    dom_tree_node.content_document.parent_node = dom_tree_node
                except Exception as e:
                    self.logger.debug(f"Failed to process content document: {e}")

            # Process shadow roots
            if 'shadowRoots' in node and node['shadowRoots']:
                dom_tree_node.shadow_roots = []
                for shadow_root in node['shadowRoots']:
                    try:
                        shadow_root_node = await _construct_enhanced_node(
                            shadow_root, updated_html_frames, total_frame_offset
                        )
                        shadow_root_node.parent_node = dom_tree_node
                        dom_tree_node.shadow_roots.append(shadow_root_node)
                    except Exception as e:
                        self.logger.debug(f"Failed to process shadow root: {e}")

            # Process child nodes
            if 'children' in node and node['children']:
                dom_tree_node.children_nodes = []
                for child in node['children']:
                    try:
                        child_node = await _construct_enhanced_node(
                            child, updated_html_frames, total_frame_offset
                        )
                        dom_tree_node.children_nodes.append(child_node)
                    except Exception as e:
                        self.logger.debug(f"Failed to process child node: {e}")

            # Enhanced visibility detection
            if self.enhanced_visibility_detection:
                dom_tree_node.is_visible = self.is_element_visible_according_to_all_parents(
                    dom_tree_node, updated_html_frames
                )

            # Enhanced cross-origin iframe processing
            if (
                self.cross_origin_iframes 
                and node_name.upper() == 'IFRAME' 
                and node.get('contentDocument', None) is None
            ):
                frame_id = node.get('frameId', None)
                if frame_id:
                    try:
                        all_frames, _ = await self.browser_session.get_all_frames()
                        frame_info = all_frames.get(frame_id)
                        iframe_document_target = None
                        
                        if frame_info and frame_info.get('frameTargetId'):
                            # Get the target info for this iframe
                            targets = await self.browser_session.cdp_client.send.Target.getTargets()
                            iframe_document_target = next(
                                (t for t in targets['targetInfos'] 
                                 if t['targetId'] == frame_info['frameTargetId']), None
                            )
                        
                        # Recursively process cross-origin iframe content
                        if iframe_document_target:
                            if self.config.get('enable_comprehensive_logging'):
                                self.logger.debug(f'Processing cross-origin iframe {frame_id}')
                                
                            timeout = self.config.get('iframe_processing_timeout', 15.0)
                            content_document = await asyncio.wait_for(
                                self.get_dom_tree(
                                    target_id=iframe_document_target.get('targetId'),
                                    initial_total_frame_offset=total_frame_offset,
                                ),
                                timeout=timeout
                            )
                            
                            dom_tree_node.content_document = content_document
                            dom_tree_node.content_document.parent_node = dom_tree_node
                            
                    except Exception as e:
                        self.logger.debug(f"Failed to process cross-origin iframe {frame_id}: {e}")

            return dom_tree_node

        # Build enhanced DOM tree starting from root
        root_node = dom_tree.get('root')
        if not root_node:
            raise ValueError("No root node found in DOM tree")
            
        enhanced_dom_tree_node = await _construct_enhanced_node(
            root_node, initial_html_frames, initial_total_frame_offset
        )

        return enhanced_dom_tree_node

    async def get_serialized_dom_tree(
        self, previous_cached_state: Optional[SerializedDOMState] = None
    ) -> tuple[SerializedDOMState, EnhancedDOMTreeNode, Dict[str, float]]:
        """Get the serialized DOM tree representation for LLM consumption with Iraqi AI enhancements.

        Returns:
            Tuple of (serialized_dom_state, enhanced_dom_tree_root, timing_info)
        """
        if not self.browser_session or not self.browser_session.current_target_id:
            raise ValueError("Browser session with current target ID is required")

        # Get enhanced DOM tree
        enhanced_dom_tree = await self.get_dom_tree(target_id=self.browser_session.current_target_id)

        # Serialize with performance tracking
        start = time.time()
        serialized_dom_state, serializer_timing = DOMTreeSerializer(
            enhanced_dom_tree, previous_cached_state
        ).serialize_accessible_elements()

        end = time.time()
        serialize_total_timing = {'serialize_dom_tree_total': end - start}

        # Combine all timing info
        all_timing = {**serializer_timing, **serialize_total_timing}

        return serialized_dom_state, enhanced_dom_tree, all_timing