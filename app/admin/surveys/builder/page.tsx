"use client"

import type React from "react"

import { useCallback, useState, useEffect, useMemo } from "react"
import ReactFlow, {
  type Connection,
  Controls,
  type Edge,
  type Node,
  useEdgesState,
  useNodesState,
  MarkerType,
  MiniMap,
  type OnNodesChange,
  applyNodeChanges,
  ReactFlowProvider,
  Background,
  getConnectedEdges,
  getIncomers,
  getOutgoers,
  useReactFlow, // Added useReactFlow for coordinate conversion
} from "reactflow"
import "reactflow/dist/style.css"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, ChevronLeft, ChevronRight, Check, Star, Trash2, Plus, Settings, Play, Save } from "lucide-react"
import { QuestionNode, type QuestionNodeData, type QuestionType } from "@/components/survey-builder/question-node"
import { CustomEdge } from "@/components/survey-builder/custom-edge"
import { QUESTION_CATEGORIES } from "@/components/survey-builder/question-categories"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils" // Assuming cn utility is available
import { Dialog, DialogContent, DialogHeader, DialogClose } from "@/components/ui/dialog" // Added Dialog imports

const initialNodes: Node<QuestionNodeData>[] = [
  {
    id: "start",
    type: "question",
    position: { x: 400, y: 100 },
    data: { label: "Start Survey", type: "start", description: "Survey entry point" },
  },
  {
    id: "end",
    type: "question",
    position: { x: 400, y: 500 },
    data: { label: "End Survey", type: "end", description: "Thank you for completing the survey!" },
  },
]

const initialEdges: Edge[] = []

const nodeTypes = {
  question: QuestionNode,
}

function SurveyBuilderContent() {
  const [nodes, setNodes, _onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [surveyTitle, setSurveyTitle] = useState("Untitled Survey")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Placeholder for other states and handlers (e.g., selectedNode, addMenu related, settings, preview, etc.)
  const [selectedNode, setSelectedNode] = useState<Node<QuestionNodeData> | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionSource, setConnectionSource] = useState<{ nodeId: string; handleId: string } | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [addMenuPosition, setAddMenuPosition] = useState({ x: 0, y: 0 })
  const [addMenuContext, setAddMenuContext] = useState<{
    type: "new" | "insert" | "direction" | null
    data?: any
  } | null>({ type: null })
  const [addMenuNodeId, setAddMenuNodeId] = useState<string | null>(null)
  const [addMenuDirection, setAddMenuDirection] = useState<string | null>(null)
  const [editingLabel, setEditingLabel] = useState("")
  const [editingType, setEditingType] = useState<QuestionType>("text")
  const [editingRequired, setEditingRequired] = useState(false)
  const [editingDescription, setEditingDescription] = useState("")
  const [editingOptions, setEditingOptions] = useState<string[]>([])
  const [showSettings, setShowSettings] = useState(false)
  const [surveySettings, setSurveySettings] = useState({
    description: "",
    welcomeMessage: "Welcome to our survey! Your feedback is valuable.",
    thankYouMessage: "Thank you for completing the survey!",
    allowAnonymous: true,
    showProgressBar: true,
    randomizeQuestions: false,
    allowMultipleSubmissions: false,
  })
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [previewCurrentNodeId, setPreviewCurrentNodeId] = useState<string | null>(null)
  const [previewAnswers, setPreviewAnswers] = useState<Record<string, any>>({})
  const [previewVisitedNodes, setPreviewVisitedNodes] = useState<string[]>([])
  const [showPreviewSidebar, setShowPreviewSidebar] = useState(true)

  const reactFlowInstance = useReactFlow()

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")

      if (typeof type === "undefined" || !type) {
        return
      }

      const position = reactFlowInstance.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })

      addNode(type as QuestionType, position)
    },
    [reactFlowInstance],
  )

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const handleInsertNodeOnEdge = useCallback(
    (edgeId: string, labelX: number, labelY: number) => {
      console.log("[v0] handleInsertNodeOnEdge called", { edgeId })
      const edge = edges.find((e) => e.id === edgeId)
      if (!edge) {
        console.log("[v0] Edge not found", edgeId)
        return
      }

      const sourceNode = nodes.find((n) => n.id === edge.source)
      const targetNode = nodes.find((n) => n.id === edge.target)

      if (!sourceNode || !targetNode) {
        console.log("[v0] Source or target node not found")
        return
      }

      const midX = (sourceNode.position.x + targetNode.position.x) / 2
      const midY = (sourceNode.position.y + targetNode.position.y) / 2

      setAddMenuPosition({ x: midX, y: midY })
      setAddMenuContext({
        type: "insert",
        data: {
          edgeId,
          sourceNode,
          targetNode,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
        },
      })
      setShowAddMenu(true)
    },
    [edges, nodes, setAddMenuPosition, setAddMenuContext, setShowAddMenu],
  )

  const edgeTypes = useMemo(
    () => ({
      custom: (props: any) => <CustomEdge {...props} data={{ ...props.data, onInsertNode: handleInsertNodeOnEdge }} />,
    }),
    [handleInsertNodeOnEdge],
  )

  useEffect(() => {
    const errorHandler = (e: ErrorEvent) => {
      if (e.message === "ResizeObserver loop completed with undelivered notifications.") {
        e.stopImmediatePropagation()
        return
      }
      if (e.message.includes("ResizeObserver loop limit exceeded")) {
        e.stopImmediatePropagation()
        return
      }
    }
    window.addEventListener("error", errorHandler)
    return () => window.removeEventListener("error", errorHandler)
  }, [])

  const onNodesDelete = useCallback(
    (deleted: Node[]) => {
      // Get all edges that are not connected to any deleted nodes
      const remainingEdges = edges.filter(
        (edge) => !deleted.some((node) => edge.source === node.id || edge.target === node.id),
      )

      // For each deleted node, reconnect its incomers to its outgoers
      const reconnectedEdges = deleted.flatMap((node) => {
        const connectedEdges = getConnectedEdges([node], edges)
        const incomers = getIncomers(node, nodes, edges)
        const outgoers = getOutgoers(node, nodes, edges)

        // Create new edges from each incomer to each outgoer
        return incomers.flatMap(({ id: source }) =>
          outgoers.map(({ id: target }) => ({
            id: `edge-${Date.now()}-${Math.random()}`,
            source,
            target,
            type: "custom",
            markerEnd: { type: MarkerType.ArrowClosed },
          })),
        )
      })

      setEdges([...remainingEdges, ...reconnectedEdges])
    },
    [nodes, edges, setEdges],
  )

  const onNodesChange: OnNodesChange = useCallback(
    (changes) => {
      const filteredChanges = changes.filter((change) => {
        if (change.type === "remove") {
          const node = nodes.find((n) => n.id === change.id)
          if (node && node.data.type === "start") {
            return false
          }
        }
        return true
      })
      setNodes((nds) => applyNodeChanges(filteredChanges, nds))
    },
    [nodes, setNodes],
  )

  const isValidConnection = useCallback(
    (connection: Connection) => {
      // Prevent self-connections
      if (connection.source === connection.target) {
        return false
      }

      const target = nodes.find((node) => node.id === connection.target)
      const hasCycle = (node: Node, visited = new Set<string>()) => {
        if (visited.has(node.id)) return false

        visited.add(node.id)

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true
          if (hasCycle(outgoer, visited)) return true
        }

        return false
      }

      if (target && hasCycle(target)) {
        console.log("[v0] Connection would create a cycle - prevented")
        return false
      }

      return true
    },
    [nodes, edges],
  )

  const onConnect = useCallback(
    (connection: Connection) => {
      console.log("[v0] onConnect called", connection)

      const sourceNode = nodes.find((n) => n.id === connection.source)

      if (connection.source === connection.target) {
        return
      }

      if (sourceNode?.data.type === "start") {
        // Start node: only 1 outgoing connection
        console.log("[v0] Start node: removing existing connections")
        setEdges((eds) => {
          const filtered = eds.filter((e) => e.source !== "start")
          const edgeId = connection.sourceHandle
            ? `e${connection.source}-${connection.sourceHandle}-${connection.target}`
            : `e${connection.source}-${connection.target}`
          return [
            ...filtered,
            {
              ...connection,
              id: edgeId,
              type: "custom",
              animated: true,
              markerEnd: { type: MarkerType.ArrowClosed },
              data: {},
            } as Edge,
          ]
        })
      } else if (sourceNode?.data.type === "radio" && connection.sourceHandle?.includes("option")) {
        // Radio option: only 1 connection per option
        console.log("[v0] Radio option: removing existing connection for", connection.sourceHandle)
        setEdges((eds) => {
          const filtered = eds.filter(
            (e) => !(e.source === connection.source && e.sourceHandle === connection.sourceHandle),
          )
          const edgeId = `e${connection.source}-${connection.sourceHandle}-${connection.target}`
          return [
            ...filtered,
            {
              ...connection,
              id: edgeId,
              type: "custom",
              animated: true,
              markerEnd: { type: MarkerType.ArrowClosed },
              data: {},
            } as Edge,
          ]
        })
      } else {
        // Regular node: only 1 outgoing connection
        console.log("[v0] Regular node: removing existing outgoing connections from", connection.source)
        setEdges((eds) => {
          const filtered = eds.filter((e) => e.source !== connection.source)
          const edgeId = connection.sourceHandle
            ? `e${connection.source}-${connection.sourceHandle}-${connection.target}`
            : `e${connection.source}-${connection.target}`
          return [
            ...filtered,
            {
              ...connection,
              id: edgeId,
              type: "custom",
              animated: true,
              markerEnd: { type: MarkerType.ArrowClosed },
              data: {},
            } as Edge,
          ]
        })
      }
    },
    [nodes, setEdges],
  )

  const onConnectStart = useCallback((_: any, params: { nodeId: string | null; handleId: string | null }) => {
    if (params.nodeId && params.handleId) {
      setIsConnecting(true)
      setConnectionSource({ nodeId: params.nodeId, handleId: params.handleId })
    }
  }, [])

  const onConnectEnd = useCallback(() => {
    setIsConnecting(false)
    setConnectionSource(null)
  }, [])

  const addNode = (type: QuestionType, position?: { x: number; y: number }) => {
    if (type === "start") {
      alert("Start node already exists")
      return null
    }

    let defaultOptions: string[] | undefined = undefined
    if (type === "radio") {
      defaultOptions = ["Option 1"] // Minimum 1 for radio
    } else if (type === "checkbox") {
      defaultOptions = ["Option 1", "Option 2"] // Minimum 2 for checkbox
    }

    const newNode: Node<QuestionNodeData> = {
      id: type === "end" ? `end-${Date.now()}` : `node-${Date.now()}`,
      type: "question",
      position: position || { x: Math.random() * 400 + 200, y: Math.random() * 400 + 300 },
      data: {
        label: type === "end" ? "End Survey" : "New Question",
        type,
        required: false,
        description: type === "end" ? "Thank you for completing the survey!" : "",
        options: defaultOptions,
        conditionalTargets: {},
      },
    }
    setNodes((nds) => [...nds, newNode])
    return newNode
  }

  useEffect(() => {
    ;(window as any).__triggerAddNode = (data: { nodeId: string; direction: string; optionIndex?: number }) => {
      console.log("[v0] __triggerAddNode called", data)
      const node = nodes.find((n) => n.id === data.nodeId)
      if (node) {
        const handlePosition = node.position
        setAddMenuPosition({
          x: handlePosition.x + (node.width || 280) / 2,
          y: handlePosition.y + (node.height || 76) + 50,
        })
        setAddMenuContext({
          type: "direction",
          data: {
            nodeId: data.nodeId,
            direction: data.direction,
            optionIndex: data.optionIndex,
          },
        })
        setShowAddMenu(true)
      }
    }

    return () => {
      ;(window as any).__triggerAddNode = undefined
    }
  }, [nodes])

  const handleAddNode = useCallback(
    (type: string) => {
      console.log("[v0] handleAddNode called", { type, context: addMenuContext })

      const newId = `node-${Date.now()}`
      let position = { x: 0, y: 0 }
      const questionType = type

      const nodeData: QuestionNodeData = {
        label: type === "start" ? "Start Survey" : type === "end" ? "End Survey" : "New Question",
        type,
        required: type !== "start" && type !== "end",
        question: "",
      }

      if (type === "radio") {
        nodeData.options = ["Option 1"]
        nodeData.conditionalTargets = {}
      } else if (type === "checkbox") {
        nodeData.options = ["Option 1", "Option 2"]
      }

      // </CHANGE> Handle insert context - create node between source and target
      if (addMenuContext?.type === "insert" && addMenuContext.data) {
        const { edgeId, sourceNode, targetNode, sourceHandle, targetHandle } = addMenuContext.data
        console.log("[v0] Insert context - creating node between", {
          sourceNode: sourceNode.id,
          targetNode: targetNode.id,
          sourceHandle,
          targetHandle,
        })

        const midX = (sourceNode.position.x + targetNode.position.x) / 2
        const midY = (sourceNode.position.y + targetNode.position.y) / 2

        const newNode: Node<QuestionNodeData> = {
          id: newId,
          type: "question",
          position: { x: midX - 140, y: midY - 80 },
          data: {
            label: "New Question",
            type: questionType,
            required: true,
            question: "",
            options:
              questionType === "radio"
                ? ["Option 1"]
                : questionType === "checkbox"
                  ? ["Option 1", "Option 2"]
                  : undefined,
            conditionalTargets: {},
            description: "",
          },
        }

        setNodes((nds) => [...nds, newNode])

        const closestSourceHandle = sourceHandle || `${sourceNode.id}-source-right`
        const closestTargetHandle = targetHandle || `${targetNode.id}-target-left`

        const newNodeSourceHandle =
          type === "radio"
            ? `${newId}-option-0` // Radio nodes use option handles
            : `${newId}-source-right` // Other nodes use regular source handles

        const edge1: Edge = {
          id: `edge-${newId}`,
          source: sourceNode.id,
          target: newId,
          sourceHandle: closestSourceHandle,
          targetHandle: `${newId}-target-left`,
          type: "custom",
          animated: true,
          markerEnd: { type: "arrowclosed" },
          data: {},
        }

        const edge2: Edge = {
          id: `edge-${newId + 1}`,
          source: newId,
          target: targetNode.id,
          sourceHandle: newNodeSourceHandle, // Use correct handle based on node type
          targetHandle: closestTargetHandle,
          type: "custom",
          animated: true,
          markerEnd: { type: "arrowclosed" },
          data: {},
        }

        console.log("[v0] Creating A->C->B edges", { edge1, edge2 })

        setEdges((eds) => {
          const edgeToRemove = edgeId
          const filteredEdges = eds.filter((e) => e.id !== edgeToRemove)
          console.log("[v0] Removed edge", edgeToRemove, "remaining edges:", filteredEdges.length)
          return [...filteredEdges, edge1, edge2]
        })

        setAddMenuContext(null)
        setShowAddMenu(false)
        return
      } else if (addMenuContext?.type === "direction" && addMenuContext.data) {
        const { nodeId, direction, optionIndex } = addMenuContext.data
        const sourceNode = nodes.find((n) => n.id === nodeId)

        console.log("[v0] Direction context", { nodeId, direction, optionIndex, sourceNode })

        if (sourceNode) {
          const offset = 250
          switch (direction) {
            case "top":
              position = { x: sourceNode.position.x, y: sourceNode.position.y - offset }
              break
            case "right":
              position = { x: sourceNode.position.x + offset, y: sourceNode.position.y }
              break
            case "bottom":
              position = { x: sourceNode.position.x, y: sourceNode.position.y + offset }
              break
            case "left":
              position = { x: sourceNode.position.x - offset, y: sourceNode.position.y }
              break
          }

          const sourceHandle =
            optionIndex !== undefined ? `${nodeId}-option-${optionIndex}` : `${nodeId}-source-${direction}`
          const oppositeDirection =
            direction === "top" ? "bottom" : direction === "bottom" ? "top" : direction === "left" ? "right" : "left"
          const targetHandle = `${newId}-target-${oppositeDirection}`

          console.log("[v0] Creating edge", { sourceHandle, targetHandle })

          const newNode: Node<QuestionNodeData> = {
            id: newId,
            type: "question",
            position,
            data: nodeData,
          }

          const newEdge: Edge = {
            id: `edge-${Date.now()}`,
            source: nodeId,
            target: newId,
            sourceHandle: sourceHandle,
            targetHandle: targetHandle,
            type: "custom",
            animated: true,
            markerEnd: { type: MarkerType.ArrowClosed },
            data: { onInsertNode: handleInsertNodeOnEdge },
          }

          console.log("[v0] New edge created", newEdge)

          setNodes((nds) => [...nds, newNode])

          setEdges((eds) => {
            let filteredEdges = eds

            if (sourceNode.data.type === "start") {
              console.log("[v0] Removing existing Start node edges")
              filteredEdges = eds.filter((e) => e.source !== nodeId)
            } else if (sourceNode.data.type === "radio" && optionIndex !== undefined) {
              console.log("[v0] Removing existing radio option edge", sourceHandle)
              filteredEdges = eds.filter((e) => !(e.source === nodeId && e.sourceHandle === sourceHandle))
            } else {
              console.log("[v0] Removing all existing edges from node")
              filteredEdges = eds.filter((e) => e.source !== nodeId)
            }

            const result = [...filteredEdges, newEdge]
            console.log("[v0] Updated edges", result)
            return result
          })

          setShowAddMenu(false)
          setAddMenuContext({ type: null, data: null })
          return
        }
      } else {
        position = addMenuPosition
      }

      const newNode: Node<QuestionNodeData> = {
        id: newId,
        type: "question",
        position,
        data: nodeData,
      }

      setNodes((nds) => [...nds, newNode])
      setShowAddMenu(false)
      setAddMenuContext({ type: null, data: null })
    },
    [nodes, edges, addMenuContext, addMenuPosition, setNodes, setEdges, handleInsertNodeOnEdge],
  )

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node<QuestionNodeData>) => {
    setSelectedNode(node)
    setEditingLabel(node.data.label)
    setEditingType(node.data.type)
    setEditingRequired(node.data.required || false)
    setEditingDescription(node.data.description || "")
    setEditingOptions(node.data.options || [])
  }, [])

  const updateNodeData = () => {
    if (!selectedNode) return

    const oldType = selectedNode.data.type
    const newType = editingType

    let finalOptions = editingOptions
    if (newType === "radio" && finalOptions.length < 1) {
      finalOptions = ["Option 1"]
    } else if (newType === "checkbox" && finalOptions.length < 2) {
      finalOptions = ["Option 1", "Option 2"]
    }

    if (oldType === "radio" && newType !== "radio") {
      setEdges((eds) =>
        eds.filter((edge) => edge.source !== selectedNode.id || !edge.sourceHandle?.startsWith("option")),
      )
    }

    if (newType !== "radio" && newType !== "checkbox") {
      finalOptions = []
    }

    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === selectedNode.id) {
          return {
            ...node,
            data: {
              ...node.data,
              label: editingLabel,
              type: editingType,
              required: editingRequired,
              description: editingDescription,
              options: finalOptions,
            },
          }
        }
        return node
      }),
    )
    setSelectedNode(null)
  }

  const deleteSelectedNode = () => {
    if (!selectedNode) return
    if (selectedNode.data.type === "start" || selectedNode.data.type === "end") {
      alert("Cannot delete Start or End nodes")
      return
    }
    setNodes((nds) => nds.filter((node) => node.id !== selectedNode.id))
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode.id && edge.target !== selectedNode.id))
    setSelectedNode(null)
  }

  const addOption = () => {
    setEditingOptions([...editingOptions, `Option ${editingOptions.length + 1}`])
  }

  const updateOption = (index: number, value: string) => {
    const newOptions = [...editingOptions]
    newOptions[index] = value
    setEditingOptions(newOptions)
  }

  const removeOption = (index: number) => {
    if (editingType === "radio" && editingOptions.length <= 1) {
      alert("Radio buttons must have at least 1 option")
      return
    }
    if (editingType === "checkbox" && editingOptions.length <= 2) {
      alert("Checkboxes must have at least 2 options")
      return
    }
    setEditingOptions(editingOptions.filter((_, idx) => idx !== index))
  }

  const buildOrderedQuestionList = (): Node<QuestionNodeData>[] => {
    const startNode = nodes.find((n) => n.data.type === "start")
    if (!startNode) return []

    const visited = new Set<string>()
    const ordered: Node<QuestionNodeData>[] = []

    const traverse = (nodeId: string) => {
      if (visited.has(nodeId)) return
      visited.add(nodeId)

      const currentNode = nodes.find((n) => n.id === nodeId)
      if (!currentNode) return

      if (currentNode.data.type !== "start") {
        ordered.push(currentNode)
      }

      if (currentNode.data.type === "end") return

      const outgoingEdges = edges.filter((e) => e.source === nodeId)
      for (const edge of outgoingEdges) {
        traverse(edge.target)
      }
    }

    traverse(startNode.id)
    return ordered
  }

  const startPreview = () => {
    const startNode = nodes.find((n) => n.data.type === "start")
    if (!startNode) {
      alert("No start node found")
      return
    }

    const nextEdge = edges.find((e) => e.source === startNode.id)
    if (!nextEdge) {
      alert("Start node is not connected to any questions")
      return
    }

    setPreviewCurrentNodeId(nextEdge.target)
    setPreviewAnswers({})
    setPreviewVisitedNodes([nextEdge.target])
    setShowPreview(true)
  }

  const handlePreviewNext = () => {
    if (!previewCurrentNodeId) return

    const currentNode = nodes.find((n) => n.id === previewCurrentNodeId)
    if (!currentNode) return

    if (currentNode.data.required) {
      const answer = previewAnswers[previewCurrentNodeId]
      if (answer === undefined || answer === null || answer === "") {
        alert("This question is required")
        return
      }
    }

    if (currentNode.data.type === "email" && previewAnswers[previewCurrentNodeId]) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(previewAnswers[previewCurrentNodeId])) {
        alert("Please enter a valid email address")
        return
      }
    }

    if (currentNode.data.type === "number" && previewAnswers[previewCurrentNodeId]) {
      if (isNaN(Number(previewAnswers[previewCurrentNodeId]))) {
        alert("Please enter a valid number")
        return
      }
    }

    if (currentNode.data.type === "date" && previewAnswers[previewCurrentNodeId]) {
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/
      if (!dateRegex.test(previewAnswers[previewCurrentNodeId])) {
        alert("Please enter a valid date (YYYY-MM-DD)")
        return
      }
    }

    let nextEdge: Edge | undefined

    if (currentNode.data.type === "radio") {
      const selectedOption = previewAnswers[previewCurrentNodeId]
      if (selectedOption !== undefined) {
        const fullHandleId = `${previewCurrentNodeId}-option-${selectedOption}`
        nextEdge = edges.find((e) => e.source === previewCurrentNodeId && e.sourceHandle === fullHandleId)
      }
    } else {
      nextEdge = edges.find((e) => e.source === previewCurrentNodeId)
    }

    if (!nextEdge) {
      const endNode = nodes.find((n) => n.data.type === "end")
      if (endNode) {
        setPreviewCurrentNodeId(endNode.id)
        if (!previewVisitedNodes.includes(endNode.id)) {
          setPreviewVisitedNodes([...previewVisitedNodes, endNode.id])
        }
      }
      return
    }

    setPreviewCurrentNodeId(nextEdge.target)
    if (!previewVisitedNodes.includes(nextEdge.target)) {
      setPreviewVisitedNodes([...previewVisitedNodes, nextEdge.target])
    }
  }

  const handlePreviewPrevious = () => {
    const currentIndex = previewVisitedNodes.indexOf(previewCurrentNodeId || "")
    if (currentIndex > 0) {
      setPreviewCurrentNodeId(previewVisitedNodes[currentIndex - 1])
    }
  }

  const handlePreviewJumpTo = (nodeId: string) => {
    setPreviewCurrentNodeId(nodeId)
  }

  const renderPreviewQuestion = () => {
    if (!previewCurrentNodeId) return null

    const currentNode = nodes.find((n) => n.id === previewCurrentNodeId)
    if (!currentNode) return null

    const currentAnswer = previewAnswers[previewCurrentNodeId]

    if (currentNode.data.type === "end") {
      return (
        <div className="text-center space-y-4">
          <div className="text-3xl font-bold">{currentNode.data.label}</div>
          <p className="text-lg text-muted-foreground">{currentNode.data.description}</p>
          <Check className="h-16 w-16 mx-auto text-green-500" />
        </div>
      )
    }

    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="text-2xl font-bold flex items-center gap-2">
            {currentNode.data.label}
            {currentNode.data.required && <Badge variant="destructive">Required</Badge>}
          </div>
          {currentNode.data.description && <p className="text-muted-foreground">{currentNode.data.description}</p>}
        </div>

        <div className="space-y-4">
          {currentNode.data.type === "text" && (
            <Input
              value={currentAnswer || ""}
              onChange={(e) => setPreviewAnswers({ ...previewAnswers, [previewCurrentNodeId]: e.target.value })}
              placeholder="Type your answer..."
              className="text-lg"
            />
          )}

          {currentNode.data.type === "textarea" && (
            <Textarea
              value={currentAnswer || ""}
              onChange={(e) => setPreviewAnswers({ ...previewAnswers, [previewCurrentNodeId]: e.target.value })}
              placeholder="Type your answer..."
              rows={6}
              className="text-lg"
            />
          )}

          {currentNode.data.type === "email" && (
            <Input
              type="email"
              value={currentAnswer || ""}
              onChange={(e) => setPreviewAnswers({ ...previewAnswers, [previewCurrentNodeId]: e.target.value })}
              placeholder="your@email.com"
              className="text-lg"
            />
          )}

          {currentNode.data.type === "number" && (
            <Input
              type="number"
              value={currentAnswer || ""}
              onChange={(e) => setPreviewAnswers({ ...previewAnswers, [previewCurrentNodeId]: e.target.value })}
              placeholder="Enter a number..."
              className="text-lg"
            />
          )}

          {currentNode.data.type === "date" && (
            <Input
              type="date"
              value={currentAnswer || ""}
              onChange={(e) => setPreviewAnswers({ ...previewAnswers, [previewCurrentNodeId]: e.target.value })}
              className="text-lg"
            />
          )}

          {currentNode.data.type === "radio" && currentNode.data.options && (
            <RadioGroup
              value={currentAnswer?.toString()}
              onValueChange={(value) =>
                setPreviewAnswers({ ...previewAnswers, [previewCurrentNodeId]: Number.parseInt(value) })
              }
            >
              {currentNode.data.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <RadioGroupItem value={idx.toString()} id={`preview-option-${idx}`} />
                  <Label htmlFor={`preview-option-${idx}`} className="text-lg cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentNode.data.type === "checkbox" && currentNode.data.options && (
            <div className="space-y-3">
              {currentNode.data.options.map((option, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted/50">
                  <Checkbox
                    id={`preview-checkbox-${idx}`}
                    checked={currentAnswer?.[idx] || false}
                    onCheckedChange={(checked) => {
                      const newAnswer = { ...(currentAnswer || {}) }
                      newAnswer[idx] = checked
                      setPreviewAnswers({ ...previewAnswers, [previewCurrentNodeId]: newAnswer })
                    }}
                  />
                  <Label htmlFor={`preview-checkbox-${idx}`} className="text-lg cursor-pointer flex-1">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}

          {currentNode.data.type === "scale" && (
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  onClick={() => setPreviewAnswers({ ...previewAnswers, [previewCurrentNodeId]: value })}
                  variant={currentAnswer === value ? "default" : "outline"}
                  size="lg"
                  className="w-16 h-16 text-xl"
                >
                  {value}
                </Button>
              ))}
            </div>
          )}

          {currentNode.data.type === "rating" && (
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((value) => (
                <Button
                  key={value}
                  onClick={() => setPreviewAnswers({ ...previewAnswers, [previewCurrentNodeId]: value })}
                  variant="ghost"
                  size="lg"
                  className="p-2"
                >
                  <Star
                    className={`h-10 w-10 ${
                      currentAnswer && currentAnswer >= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    }`}
                  />
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  const handleSaveSurvey = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      setShowSaveDialog(false)
      alert("Survey saved successfully!")
    }, 1500)
  }

  const orderedQuestions = buildOrderedQuestionList()
  const totalQuestions = orderedQuestions.filter((n) => n.data.type !== "end").length
  const answeredQuestions = Object.keys(previewAnswers).length
  const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0

  const getClosestHandle = (sourceNode: Node, targetNode: Node) => {
    const dx = targetNode.position.x - sourceNode.position.x
    const dy = targetNode.position.y - sourceNode.position.y

    const absDx = Math.abs(dx)
    const absDy = Math.abs(dy)

    if (absDx > absDy) {
      return dx > 0 ? "right" : "left"
    } else {
      return dy > 0 ? "bottom" : "top"
    }
  }

  const handleAddNodeFromPlus = ({ nodeId, direction }: { nodeId: string; direction: string }) => {
    setShowAddMenu(true)
    setAddMenuNodeId(nodeId)
    setAddMenuDirection(direction)

    const sourceNode = nodes.find((n) => n.id === nodeId)
    if (sourceNode) {
      const viewport = document.querySelector(".react-flow__viewport")
      if (viewport) {
        const rect = viewport.getBoundingClientRect()
        setAddMenuPosition({
          x: rect.left + rect.width / 2,
          y: rect.top + rect.height / 2,
        })
      }
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Top Navigation Bar */}
      <div className="flex-none h-14 border-b bg-background flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-semibold">Survey Builder</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowSettings(true)}>
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
          <Button variant="outline" size="sm" onClick={startPreview}>
            <Play className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm" onClick={() => setShowSaveDialog(true)}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      {/* Main content area with sidebars and canvas */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div
          className={cn(
            "border-r bg-muted/30 flex flex-col transition-all duration-300",
            sidebarOpen ? "w-80" : "w-0 overflow-hidden",
          )}
        >
          <div className="flex-none p-4 border-b flex items-center justify-between">
            <h3 className="font-semibold">Questions</h3>
            <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 h-0 p-4">
            <div className="space-y-6">
              {Object.entries(QUESTION_CATEGORIES).map(([category, items]) => (
                <div key={category} className="space-y-2">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">
                    {category}
                  </div>
                  {items.map((item) => (
                    <button
                      key={item.type}
                      draggable
                      onDragStart={(event) => onDragStart(event, item.type)}
                      onClick={() => {
                        const position = { x: 400, y: 300 }
                        addNode(item.type, position)
                      }}
                      className="w-full flex items-start gap-3 p-3 rounded-lg border bg-background hover:bg-accent hover:border-primary transition-colors text-left cursor-grab active:cursor-grabbing"
                    >
                      <item.icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{item.label}</div>
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        {!sidebarOpen && (
          <Button
            variant="outline"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="absolute left-2 top-4 z-10 h-9 w-9"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}

        {/* Main Canvas */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 bg-background">
            <div className="h-full w-full">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onNodesDelete={onNodesDelete}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                isValidConnection={isValidConnection}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                connectionRadius={50}
                onConnectStart={onConnectStart}
                onConnectEnd={onConnectEnd}
                onDrop={onDrop}
                onDragOver={onDragOver}
                proOptions={{ hideAttribution: true }}
                fitView
                defaultEdgeOptions={{
                  type: "custom",
                  animated: true,
                  markerEnd: { type: MarkerType.ArrowClosed },
                }}
                minZoom={0.2}
                maxZoom={4}
                onNodeClick={onNodeClick}
              >
                <Background />
                <Controls />
                <MiniMap />
              </ReactFlow>
            </div>
          </div>

          {showAddMenu && (
            <div
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center"
              onClick={() => setShowAddMenu(false)}
            >
              <div
                className="bg-background border-2 border-border rounded-xl shadow-2xl flex flex-col w-[500px] max-w-[90vw] max-h-[809px]"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 border-b bg-muted/50 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Add Question</h3>
                    <Button variant="ghost" size="icon" onClick={() => setShowAddMenu(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <ScrollArea className="flex-1 overflow-y-auto">
                  <div className="p-4 space-y-6">
                    {Object.entries(QUESTION_CATEGORIES).map(([category, questions]) => (
                      <div key={category}>
                        <h4 className="text-sm font-semibold text-muted-foreground mb-3">{category}</h4>
                        <div className="grid gap-2">
                          {questions.map((q) => {
                            const Icon = q.icon
                            return (
                              <button
                                key={q.type}
                                onClick={() => handleAddNode(q.type)}
                                className="flex items-start gap-3 p-3 rounded-lg border bg-card hover:bg-accent hover:border-primary transition-colors text-left w-full"
                              >
                                <div className="mt-0.5 flex-shrink-0">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-sm">{q.label}</div>
                                  <div className="text-xs text-muted-foreground mt-0.5">{q.description}</div>
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l bg-background flex-shrink-0 flex flex-col h-full">
          <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
            <h3 className="font-semibold">Edit Question</h3>
            <Button variant="ghost" size="icon" onClick={() => setSelectedNode(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ScrollArea className="flex-1 h-0 p-4">
            {selectedNode ? (
              <div className="space-y-4">
                {selectedNode.data.type !== "start" && selectedNode.data.type !== "end" && (
                  <>
                    <div className="space-y-2">
                      <Label>Question Type</Label>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { value: "text", label: "Text" },
                          { value: "textarea", label: "Paragraph" },
                          { value: "radio", label: "Single" },
                          { value: "checkbox", label: "Multiple" },
                          { value: "email", label: "Email" },
                          { value: "number", label: "Number" },
                          { value: "date", label: "Date" },
                          { value: "scale", label: "Scale" },
                          { value: "rating", label: "Rating" },
                        ].map((type) => (
                          <Button
                            key={type.value}
                            variant={editingType === type.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setEditingType(type.value as QuestionType)}
                          >
                            {type.label}
                          </Button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label>Question Label</Label>
                      <Input value={editingLabel} onChange={(e) => setEditingLabel(e.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label>Description (Optional)</Label>
                      <Textarea
                        value={editingDescription}
                        onChange={(e) => setEditingDescription(e.target.value)}
                        rows={3}
                      />
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch checked={editingRequired} onCheckedChange={setEditingRequired} id="required" />
                      <Label htmlFor="required">Required</Label>
                    </div>
                  </>
                )}

                {(editingType === "radio" || editingType === "checkbox") && (
                  <div className="space-y-2">
                    <Label>Options</Label>
                    <div className="space-y-2">
                      {editingOptions.map((option, idx) => (
                        <div key={idx} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(idx, e.target.value)}
                            placeholder={`Option ${idx + 1}`}
                          />
                          <Button variant="ghost" size="icon" onClick={() => removeOption(idx)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                    <Button variant="outline" size="sm" onClick={addOption} className="w-full bg-transparent">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Option
                    </Button>
                  </div>
                )}

                {selectedNode.data.type !== "start" && selectedNode.data.type !== "end" && (
                  <div className="space-y-2 pt-4">
                    <Button onClick={updateNodeData} className="w-full">
                      <Check className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="destructive" onClick={deleteSelectedNode} className="w-full">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Question
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center p-6 text-muted-foreground">
                <p className="text-sm">Select a question node to edit its properties</p>
              </div>
            )}
          </ScrollArea>
        </div>
      </div>

      {/* Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Survey Settings</h2>
              <DialogClose asChild>
                <Button variant="ghost" size="icon">
                  <X className="h-4 w-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <Label>Survey Title</Label>
              <Input value={surveyTitle} onChange={(e) => setSurveyTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={surveySettings.description}
                onChange={(e) => setSurveySettings({ ...surveySettings, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Welcome Message</Label>
              <Textarea
                value={surveySettings.welcomeMessage}
                onChange={(e) => setSurveySettings({ ...surveySettings, welcomeMessage: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label>Thank You Message</Label>
              <Textarea
                value={surveySettings.thankYouMessage}
                onChange={(e) => setSurveySettings({ ...surveySettings, thankYouMessage: e.target.value })}
                rows={2}
              />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Allow Anonymous Responses</Label>
                <Switch
                  checked={surveySettings.allowAnonymous}
                  onCheckedChange={(checked) => setSurveySettings({ ...surveySettings, allowAnonymous: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Show Progress Bar</Label>
                <Switch
                  checked={surveySettings.showProgressBar}
                  onCheckedChange={(checked) => setSurveySettings({ ...surveySettings, showProgressBar: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Randomize Questions</Label>
                <Switch
                  checked={surveySettings.randomizeQuestions}
                  onCheckedChange={(checked) => setSurveySettings({ ...surveySettings, randomizeQuestions: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label>Allow Multiple Submissions</Label>
                <Switch
                  checked={surveySettings.allowMultipleSubmissions}
                  onCheckedChange={(checked) =>
                    setSurveySettings({ ...surveySettings, allowMultipleSubmissions: checked })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-2 p-4 border-t">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={() => setShowSettings(false)}>Save Settings</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-md p-6">
            <h2 className="text-lg font-semibold mb-4">Save Survey</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Are you sure you want to save the current survey configuration?
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowSaveDialog(false)} disabled={isSaving}>
                Cancel
              </Button>
              <Button onClick={handleSaveSurvey} disabled={isSaving}>
                {isSaving ? "Saving..." : "Save Survey"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Panel */}
      {showPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background rounded-lg shadow-lg w-full max-w-4xl h-[80vh] flex">
            {/* Preview Navigation Sidebar */}
            <div
              className={cn(
                "border-r bg-muted/30 flex flex-col transition-all duration-300",
                showPreviewSidebar ? "w-64" : "w-0 overflow-hidden",
              )}
            >
              <div className="flex-none p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold">Navigation</h3>
                <Button variant="ghost" size="icon" onClick={() => setShowPreviewSidebar(false)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              </div>
              <ScrollArea className="flex-1 h-0 p-4">
                <div className="space-y-2">
                  {orderedQuestions.map((node) => (
                    <Button
                      key={node.id}
                      variant={previewCurrentNodeId === node.id ? "default" : "ghost"}
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handlePreviewJumpTo(node.id)}
                    >
                      {previewVisitedNodes.includes(node.id) && <Check className="h-4 w-4 mr-2" />}
                      {node.data.label}
                    </Button>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Preview Content */}
            <div className="flex-1 flex flex-col">
              <div className="flex-none p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {!showPreviewSidebar && (
                    <Button variant="ghost" size="icon" onClick={() => setShowPreviewSidebar(true)}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                  <h2 className="text-lg font-semibold">Survey Preview</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowPreview(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {surveySettings.showProgressBar && (
                <div className="flex-none px-4 py-2 border-b">
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progressPercentage)}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${progressPercentage}%` }}
                    />
                  </div>
                </div>
              )}

              <div className="flex-1 overflow-y-auto p-6">{renderPreviewQuestion()}</div>

              <div className="flex-none p-4 border-t flex justify-between">
                <Button
                  variant="outline"
                  onClick={handlePreviewPrevious}
                  disabled={previewVisitedNodes.indexOf(previewCurrentNodeId || "") === 0}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={handlePreviewNext}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Question Menu - REMOVED DUPLICATE */}
      {/* The duplicate add question modal has been removed here. */}
    </div>
  )
}

export default function SurveyBuilderPage() {
  return (
    <ReactFlowProvider>
      <SurveyBuilderContent />
    </ReactFlowProvider>
  )
}
