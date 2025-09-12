import { Handle, Position, NodeProps } from 'reactflow';

export const iraqiNodeTypes = {
  culturalValidator: (props: NodeProps) => (
    <div style={{ padding: 10, border: '1px solid #000', borderRadius: 5, background: '#fff', textAlign: 'right', direction: 'rtl' }}>
      <Handle type="target" position={Position.Left} />
      <div>عقدة التحقق الثقافي (95%+)</div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
  arabicProcessor: (props: NodeProps) => (
    <div style={{ padding: 10, border: '1px solid #000', borderRadius: 5, background: '#fff', textAlign: 'right', direction: 'rtl' }}>
      <Handle type="target" position={Position.Left} />
      <div>معالج النصوص العربية</div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
  legalWorkflow: (props: NodeProps) => (
    <div style={{ padding: 10, border: '1px solid #000', borderRadius: 5, background: '#fff', textAlign: 'right', direction: 'rtl' }}>
      <Handle type="target" position={Position.Left} />
      <div>تدفق الاستشارة القانونية</div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
  medicalTriage: (props: NodeProps) => (
    <div style={{ padding: 10, border: '1px solid #000', borderRadius: 5, background: '#fff', textAlign: 'right', direction: 'rtl' }}>
      <Handle type="target" position={Position.Left} />
      <div>تدفق الفرز الطبي</div>
      <Handle type="source" position={Position.Right} />
    </div>
  ),
};

export const iraqiNodes = iraqiNodeTypes;