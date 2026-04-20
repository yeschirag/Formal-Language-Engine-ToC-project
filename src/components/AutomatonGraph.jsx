import { useCallback, useEffect, useMemo, useRef } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import StateNode from './nodes/StateNode';
import TransitionEdge from './edges/TransitionEdge';
import { buildAutomatonFlow } from './flowUtils';

const nodeTypes = { stateNode: StateNode };
const edgeTypes = { transition: TransitionEdge };

export default function AutomatonGraph({ automaton }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const prevNodesRef = useRef([]);
  const shellRef = useRef(null);
  const reactFlowRef = useRef(null);
  const flow = useMemo(
    () => buildAutomatonFlow(automaton, prevNodesRef.current, { layout: 'grid' }),
    [automaton]
  );

  const scheduleFitView = useCallback(() => {
    if (!automaton || !reactFlowRef.current) return;

    // Delay fit until layout has settled to avoid top-anchored graphs.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        reactFlowRef.current?.fitView({
          padding: 0.2,
          maxZoom: 1.2,
          duration: 220,
        });
      });
    });
  }, [automaton]);

  useEffect(() => {
    if (!automaton) {
      setNodes([]);
      setEdges([]);
      prevNodesRef.current = [];
      return;
    }
    prevNodesRef.current = flow.nodes;
    setNodes(flow.nodes);
    setEdges(flow.edges);
    scheduleFitView();
  }, [automaton, flow, setNodes, setEdges, scheduleFitView]);

  useEffect(() => {
    if (!automaton || !shellRef.current) return;

    const observer = new ResizeObserver(() => {
      scheduleFitView();
    });

    observer.observe(shellRef.current);
    return () => observer.disconnect();
  }, [automaton, scheduleFitView]);

  if (!automaton) {
    return (
      <div className="graph-empty-state">
        <div className="graph-empty-icon" role="img" aria-label="Search">
          🔍
        </div>
        <h3>Awaiting an automaton</h3>
        <p>Enter a regex and generate the ε-NFA to inspect the resulting graph.</p>
      </div>
    );
  }

  return (
    <div className="automaton-flow-shell" ref={shellRef}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onInit={(instance) => {
          reactFlowRef.current = instance;
          scheduleFitView();
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.2 }}
        attributionPosition="bottom-left"
        minZoom={0.2}
        maxZoom={2}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        className="automaton-flow"
      >
        <Background color="hsl(var(--border))" gap={24} size={1.3} variant="dots" />
        <Controls showInteractive={false} />
      </ReactFlow>
    </div>
  );
}
