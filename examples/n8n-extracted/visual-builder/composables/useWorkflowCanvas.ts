/**
 * Workflow Canvas Composable
 * Manages canvas state, interactions, and viewport operations with RTL support
 */

import { ref, reactive, computed } from "vue";
import type {
  IraqiWorkflow,
  IraqiWorkflowNode,
  IraqiWorkflowConnection,
  CanvasViewport,
} from "../types/workflow.types";

export interface CanvasInteractionState {
  isDragging: boolean;
  isSelecting: boolean;
  isPanning: boolean;
  isConnecting: boolean;
  dragOffset: { x: number; y: number };
  lastMousePosition: { x: number; y: number };
}

export interface SelectionRect {
  startX: number;
  startY: number;
  endX: number;
  endY: number;
}

export function useWorkflowCanvas(workflow: IraqiWorkflow) {
  // Viewport state
  const viewport = reactive<CanvasViewport>({
    x: 0,
    y: 0,
    zoom: workflow.layout.zoomLevel || 1,
    rtl: {
      textDirection: workflow.layout.direction || "ltr",
      layoutDirection: workflow.layout.direction || "ltr",
      arabicFontEnabled:
        workflow.layout.primaryLanguage === "arabic" ||
        workflow.layout.primaryLanguage === "bilingual",
      bidiSupport: workflow.layout.direction === "mixed",
    },
    cultural: {
      showArabicLabels: workflow.cultural.arabicSupported,
      showIslamicCompliance: workflow.cultural.islamicCompliant,
      showPrayerTimeIndicators:
        workflow.scheduling?.prayerTimeExclusions || false,
      culturalTheme:
        workflow.domain?.type !== "general" ? "ministry" : "default",
    },
  });

  // Selection state
  const selectedNodes = ref<string[]>([]);
  const selectedConnections = ref<string[]>([]);
  const selectionRect = ref<SelectionRect | null>(null);

  // Interaction state
  const interactionState = reactive<CanvasInteractionState>({
    isDragging: false,
    isSelecting: false,
    isPanning: false,
    isConnecting: false,
    dragOffset: { x: 0, y: 0 },
    lastMousePosition: { x: 0, y: 0 },
  });

  // Drag and drop state
  const draggedNode = ref<IraqiWorkflowNode | null>(null);
  const temporaryConnection = ref<Partial<IraqiWorkflowConnection> | null>(
    null,
  );
  const mousePosition = ref({ x: 0, y: 0 });

  // Grid and snapping
  const gridSize = ref(20);
  const snapToGrid = ref(true);

  // Canvas bounds
  const canvasBounds = reactive({
    minX: -10000,
    minY: -10000,
    maxX: 10000,
    maxY: 10000,
  });

  // Computed properties
  const isRTL = computed(() => viewport.rtl?.layoutDirection === "rtl");
  const hasSelection = computed(
    () =>
      selectedNodes.value.length > 0 || selectedConnections.value.length > 0,
  );
  const canvasTransform = computed(() => ({
    x: viewport.x,
    y: viewport.y,
    zoom: viewport.zoom,
    flipX: isRTL.value ? -1 : 1,
  }));

  // Viewport operations
  const centerCanvas = () => {
    if (workflow.nodes.length === 0) {
      viewport.x = 0;
      viewport.y = 0;
      return;
    }

    const bounds = getWorkflowBounds();
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    // Adjust for RTL layout
    if (isRTL.value) {
      viewport.x = -centerX * viewport.zoom + window.innerWidth / 2;
    } else {
      viewport.x = -centerX * viewport.zoom + window.innerWidth / 2;
    }
    viewport.y = -centerY * viewport.zoom + window.innerHeight / 2;
  };

  const fitToContent = () => {
    if (workflow.nodes.length === 0) {
      centerCanvas();
      return;
    }

    const bounds = getWorkflowBounds();
    const padding = 100;

    const contentWidth = bounds.maxX - bounds.minX + padding * 2;
    const contentHeight = bounds.maxY - bounds.minY + padding * 2;

    const containerWidth = window.innerWidth - 320; // Account for side panels
    const containerHeight = window.innerHeight - 120; // Account for headers/footers

    const scaleX = containerWidth / contentWidth;
    const scaleY = containerHeight / contentHeight;
    const scale = Math.min(scaleX, scaleY, 1); // Don't zoom in beyond 100%

    viewport.zoom = Math.max(0.1, Math.min(3, scale));

    // Center the content
    const centerX = (bounds.minX + bounds.maxX) / 2;
    const centerY = (bounds.minY + bounds.maxY) / 2;

    if (isRTL.value) {
      viewport.x = -centerX * viewport.zoom + containerWidth / 2;
    } else {
      viewport.x = -centerX * viewport.zoom + containerWidth / 2;
    }
    viewport.y = -centerY * viewport.zoom + containerHeight / 2;
  };

  const zoomIn = () => {
    const newZoom = Math.min(3, viewport.zoom * 1.2);
    zoomToPoint(
      { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      newZoom,
    );
  };

  const zoomOut = () => {
    const newZoom = Math.max(0.1, viewport.zoom / 1.2);
    zoomToPoint(
      { x: window.innerWidth / 2, y: window.innerHeight / 2 },
      newZoom,
    );
  };

  const zoomToPoint = (point: { x: number; y: number }, newZoom: number) => {
    const oldZoom = viewport.zoom;
    const zoomRatio = newZoom / oldZoom;

    // Calculate the point in canvas coordinates
    const canvasX = (point.x - viewport.x) / oldZoom;
    const canvasY = (point.y - viewport.y) / oldZoom;

    // Update zoom
    viewport.zoom = newZoom;

    // Adjust viewport to keep the point under the cursor
    viewport.x = point.x - canvasX * newZoom;
    viewport.y = point.y - canvasY * newZoom;

    constrainViewport();
  };

  const panViewport = (deltaX: number, deltaY: number) => {
    // Apply RTL adjustment for panning
    const adjustedDeltaX = isRTL.value ? -deltaX : deltaX;

    viewport.x += adjustedDeltaX;
    viewport.y += deltaY;

    constrainViewport();
  };

  const constrainViewport = () => {
    // Prevent viewport from going too far out of bounds
    const maxOffset = 5000;
    viewport.x = Math.max(-maxOffset, Math.min(maxOffset, viewport.x));
    viewport.y = Math.max(-maxOffset, Math.min(maxOffset, viewport.y));
  };

  // Coordinate conversion
  const screenToCanvas = (screenX: number, screenY: number) => {
    const canvasX = (screenX - viewport.x) / viewport.zoom;
    const canvasY = (screenY - viewport.y) / viewport.zoom;

    // Apply RTL transformation
    if (isRTL.value) {
      return { x: -canvasX, y: canvasY };
    }

    return { x: canvasX, y: canvasY };
  };

  const canvasToScreen = (canvasX: number, canvasY: number) => {
    // Apply RTL transformation
    const adjustedX = isRTL.value ? -canvasX : canvasX;

    return {
      x: adjustedX * viewport.zoom + viewport.x,
      y: canvasY * viewport.zoom + viewport.y,
    };
  };

  const snapToGridPosition = (x: number, y: number) => {
    if (!snapToGrid.value) return { x, y };

    return {
      x: Math.round(x / gridSize.value) * gridSize.value,
      y: Math.round(y / gridSize.value) * gridSize.value,
    };
  };

  // Node operations
  const selectNode = (nodeId: string, addToSelection = false) => {
    if (!addToSelection) {
      selectedNodes.value = [nodeId];
      selectedConnections.value = [];
    } else if (!selectedNodes.value.includes(nodeId)) {
      selectedNodes.value.push(nodeId);
    }
  };

  const deselectNode = (nodeId: string) => {
    const index = selectedNodes.value.indexOf(nodeId);
    if (index > -1) {
      selectedNodes.value.splice(index, 1);
    }
  };

  const selectConnection = (connectionId: string, addToSelection = false) => {
    if (!addToSelection) {
      selectedConnections.value = [connectionId];
      selectedNodes.value = [];
    } else if (!selectedConnections.value.includes(connectionId)) {
      selectedConnections.value.push(connectionId);
    }
  };

  const clearSelection = () => {
    selectedNodes.value = [];
    selectedConnections.value = [];
  };

  const selectNodesInRect = (rect: SelectionRect) => {
    const minX = Math.min(rect.startX, rect.endX);
    const minY = Math.min(rect.startY, rect.endY);
    const maxX = Math.max(rect.startX, rect.endX);
    const maxY = Math.max(rect.startY, rect.endY);

    const nodesInRect = workflow.nodes.filter((node) => {
      const nodeX = node.position.x;
      const nodeY = node.position.y;
      const nodeSize = 150; // Approximate node size

      return (
        nodeX >= minX &&
        nodeX + nodeSize <= maxX &&
        nodeY >= minY &&
        nodeY + nodeSize <= maxY
      );
    });

    selectedNodes.value = nodesInRect.map((node) => node.id);
  };

  // Node movement
  const moveNode = (nodeId: string, newPosition: { x: number; y: number }) => {
    const node = workflow.nodes.find((n) => n.id === nodeId);
    if (!node) return;

    // Apply grid snapping
    const snappedPosition = snapToGridPosition(newPosition.x, newPosition.y);

    // Update node position
    node.position = snappedPosition;

    // If multiple nodes are selected, move them all relative to this node
    if (
      selectedNodes.value.length > 1 &&
      selectedNodes.value.includes(nodeId)
    ) {
      const deltaX = snappedPosition.x - node.position.x;
      const deltaY = snappedPosition.y - node.position.y;

      selectedNodes.value.forEach((id) => {
        if (id !== nodeId) {
          const otherNode = workflow.nodes.find((n) => n.id === id);
          if (otherNode) {
            otherNode.position.x += deltaX;
            otherNode.position.y += deltaY;
          }
        }
      });
    }
  };

  const duplicateSelectedNodes = () => {
    const nodesToDuplicate = workflow.nodes.filter((node) =>
      selectedNodes.value.includes(node.id),
    );

    const newNodes: IraqiWorkflowNode[] = [];
    const nodeIdMap: Record<string, string> = {};

    // Create new nodes
    nodesToDuplicate.forEach((node) => {
      const newId = `${node.id}_copy_${Date.now()}`;
      nodeIdMap[node.id] = newId;

      const newNode: IraqiWorkflowNode = {
        ...node,
        id: newId,
        name: `${node.name} Copy`,
        position: {
          x: node.position.x + 50,
          y: node.position.y + 50,
        },
      };

      // Update Arabic name if present
      if (node.culturalSettings?.arabicLabel) {
        newNode.culturalSettings = {
          ...node.culturalSettings,
          arabicLabel: `${node.culturalSettings.arabicLabel} نسخة`,
        };
      }

      newNodes.push(newNode);
    });

    // Add new nodes to workflow
    workflow.nodes.push(...newNodes);

    // Duplicate connections between duplicated nodes
    const connectionsToAdd: IraqiWorkflowConnection[] = [];
    workflow.connections.forEach((connection) => {
      const sourceInSelection = nodeIdMap[connection.sourceNodeId];
      const targetInSelection = nodeIdMap[connection.targetNodeId];

      if (sourceInSelection && targetInSelection) {
        const newConnection: IraqiWorkflowConnection = {
          ...connection,
          id: `${connection.id}_copy_${Date.now()}`,
          sourceNodeId: sourceInSelection,
          targetNodeId: targetInSelection,
        };
        connectionsToAdd.push(newConnection);
      }
    });

    workflow.connections.push(...connectionsToAdd);

    // Select the new nodes
    selectedNodes.value = newNodes.map((node) => node.id);
  };

  const deleteSelectedNodes = () => {
    // Remove nodes
    workflow.nodes = workflow.nodes.filter(
      (node) => !selectedNodes.value.includes(node.id),
    );

    // Remove connections connected to deleted nodes
    workflow.connections = workflow.connections.filter(
      (connection) =>
        !selectedNodes.value.includes(connection.sourceNodeId) &&
        !selectedNodes.value.includes(connection.targetNodeId),
    );

    clearSelection();
  };

  // Connection operations
  const startConnection = (sourceNodeId: string, sourcePort?: string) => {
    interactionState.isConnecting = true;
    temporaryConnection.value = {
      id: `temp_${Date.now()}`,
      sourceNodeId,
      sourcePort,
      targetNodeId: "",
      targetPort: undefined,
    };
  };

  const completeConnection = (targetNodeId: string, targetPort?: string) => {
    if (!temporaryConnection.value) return;

    const newConnection: IraqiWorkflowConnection = {
      id: `connection_${Date.now()}`,
      sourceNodeId: temporaryConnection.value.sourceNodeId!,
      targetNodeId,
      sourcePort: temporaryConnection.value.sourcePort,
      targetPort,

      // Add cultural properties for RTL layouts
      cultural: {
        arabicLabel: workflow.cultural.arabicSupported
          ? `اتصال من ${temporaryConnection.value.sourceNodeId} إلى ${targetNodeId}`
          : undefined,
      },
      visual: {
        rtlCurve: isRTL.value,
      },
    };

    workflow.connections.push(newConnection);
    cancelConnection();
  };

  const cancelConnection = () => {
    interactionState.isConnecting = false;
    temporaryConnection.value = null;
  };

  const deleteConnection = (connectionId: string) => {
    const index = workflow.connections.findIndex((c) => c.id === connectionId);
    if (index > -1) {
      workflow.connections.splice(index, 1);
    }
  };

  // Utility functions
  const getWorkflowBounds = () => {
    if (workflow.nodes.length === 0) {
      return { minX: 0, minY: 0, maxX: 0, maxY: 0 };
    }

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    workflow.nodes.forEach((node) => {
      const nodeSize = 150; // Approximate node size
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + nodeSize);
      maxY = Math.max(maxY, node.position.y + nodeSize);
    });

    return { minX, minY, maxX, maxY };
  };

  const getNodeAt = (x: number, y: number): IraqiWorkflowNode | null => {
    // Find node at given canvas coordinates
    for (const node of workflow.nodes) {
      const nodeSize = 150; // Approximate node size
      if (
        x >= node.position.x &&
        x <= node.position.x + nodeSize &&
        y >= node.position.y &&
        y <= node.position.y + nodeSize
      ) {
        return node;
      }
    }
    return null;
  };

  const getConnectionAt = (
    x: number,
    y: number,
  ): IraqiWorkflowConnection | null => {
    // This would require more complex geometry calculations
    // For now, return null - would need to implement connection hit testing
    return null;
  };

  // Cultural and RTL helpers
  const updateLayoutDirection = (direction: "ltr" | "rtl" | "mixed") => {
    if (viewport.rtl) {
      viewport.rtl.layoutDirection = direction;
      viewport.rtl.textDirection = direction;
    }

    // Update workflow layout
    workflow.layout.direction = direction;

    // Re-center canvas if switching to RTL
    if (direction === "rtl") {
      centerCanvas();
    }
  };

  const toggleArabicLabels = () => {
    if (viewport.cultural) {
      viewport.cultural.showArabicLabels = !viewport.cultural.showArabicLabels;
    }
  };

  const updateCulturalTheme = (theme: string) => {
    if (viewport.cultural) {
      viewport.cultural.culturalTheme = theme;
    }
  };

  return {
    // State
    viewport,
    selectedNodes,
    selectedConnections,
    selectionRect,
    interactionState,
    draggedNode,
    temporaryConnection,
    mousePosition,
    gridSize,
    snapToGrid,

    // Computed
    isRTL,
    hasSelection,
    canvasTransform,

    // Viewport operations
    centerCanvas,
    fitToContent,
    zoomIn,
    zoomOut,
    zoomToPoint,
    panViewport,
    constrainViewport,

    // Coordinate conversion
    screenToCanvas,
    canvasToScreen,
    snapToGridPosition,

    // Selection operations
    selectNode,
    deselectNode,
    selectConnection,
    clearSelection,
    selectNodesInRect,

    // Node operations
    moveNode,
    duplicateSelectedNodes,
    deleteSelectedNodes,

    // Connection operations
    startConnection,
    completeConnection,
    cancelConnection,
    deleteConnection,

    // Utility functions
    getWorkflowBounds,
    getNodeAt,
    getConnectionAt,

    // Cultural operations
    updateLayoutDirection,
    toggleArabicLabels,
    updateCulturalTheme,
  };
}
