import React, { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  useReactFlow,
  BackgroundVariant,
} from 'reactflow';

import '@styles/globals.css';

import { iraqiNodes } from './iraqi-nodes';

const initialNodes = [
  {
    id: '1',
    type: 'culturalValidator',
    data: { label: 'Cultural Validator Node' },
    position: { x: 250, y: 25 },
  },
  {
    id: '2',
    type: 'arabicProcessor',
    data: { label: 'Arabic Processor' },
    position: { x: 100, y: 125 },
  },
  {
    id: '3',
    type: 'legalWorkflow',
    data: { label: 'Legal Consultation Flow' },
    position: { x: 300, y: 200 },
  },
];

const initialEdges = [
  { id: 'e1-2', source: '1', target: '2' },
  { id: 'e2-3', source: '2', target: '3' },
];

export default function WorkflowBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const { addEdge } = useReactFlow();

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <div style={{ width: '100vw', height: '100vh', direction: 'rtl' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={iraqiNodes}
        fitView
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}