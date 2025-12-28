"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, Shield, AlertTriangle, ArrowRight } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface AuthStep {
  id: string
  method: string
  mode: "required" | "conditional"
  name?: string
  description?: string
  conditions?: Array<{
    type: string
    operator: string
    value: string
  }>
}

interface AuthChainBuilderProps {
  role: "admin" | "student" | "professor"
  authChain: AuthStep[]
  onAuthChainChange: (chain: AuthStep[]) => void
  trustedLocations: any[]
  trustedDevices: any[]
  trustedTimeRanges: any[]
  trustedIpRanges: any[]
}

const AUTH_METHODS = [
  { value: "password", label: "비밀번호", description: "기본 비밀번호 인증" },
  { value: "totp", label: "TOTP", description: "시간 기반 일회용 비밀번호 (Google Authenticator)" },
  { value: "fido", label: "FIDO/WebAuthn", description: "생체 인증 또는 보안 키" },
  { value: "email", label: "이메일 인증", description: "이메일로 전송된 코드 입력" },
  { value: "sms", label: "SMS 인증", description: "문자 메시지로 전송된 코드 입력" },
]

const CONDITION_TYPES = [
  { value: "risk", label: "위험 수준" },
  { value: "location", label: "위치" },
  { value: "device", label: "디바이스" },
  { value: "time", label: "시간대" },
  { value: "ip", label: "IP 범위" },
]

const RISK_OPERATORS = [
  { value: "gte", label: "이상" },
  { value: "lte", label: "이하" },
  { value: "eq", label: "같음" },
]

const LOCATION_OPERATORS = [
  { value: "in", label: "포함" },
  { value: "not_in", label: "포함 안 됨" },
]

export function AuthChainBuilder({
  role,
  authChain,
  onAuthChainChange,
  trustedLocations,
  trustedDevices,
  trustedTimeRanges,
  trustedIpRanges,
}: AuthChainBuilderProps) {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newStep, setNewStep] = useState<Partial<AuthStep & { name: string; description: string }>>({
    method: "password",
    mode: "required",
    name: "",
    description: "",
    conditions: [],
  })

  const addAuthStep = () => {
    const step: AuthStep = {
      id: Date.now().toString(),
      method: newStep.method || "password",
      mode: newStep.mode || "required",
      name: newStep.name,
      description: newStep.description,
      conditions: newStep.mode === "conditional" && newStep.conditions?.length ? newStep.conditions : undefined,
    }
    onAuthChainChange([...authChain, step])
    setIsAddModalOpen(false)
    setNewStep({ method: "password", mode: "required", name: "", description: "", conditions: [] })
  }

  const removeAuthStep = (id: string) => {
    onAuthChainChange(authChain.filter((step) => step.id !== id))
  }

  const updateAuthStep = (id: string, updates: Partial<AuthStep>) => {
    onAuthChainChange(authChain.map((step) => (step.id === id ? { ...step, ...updates } : step)))
  }

  const addCondition = (stepId: string) => {
    const step = authChain.find((s) => s.id === stepId)
    if (step) {
      const newCondition = {
        type: "risk",
        operator: "gte",
        value: "medium",
      }
      updateAuthStep(stepId, {
        conditions: [...(step.conditions || []), newCondition],
      })
    }
  }

  const removeCondition = (stepId: string, conditionIndex: number) => {
    const step = authChain.find((s) => s.id === stepId)
    if (step && step.conditions) {
      const newConditions = step.conditions.filter((_, i) => i !== conditionIndex)
      updateAuthStep(stepId, { conditions: newConditions })
    }
  }

  const updateCondition = (stepId: string, conditionIndex: number, updates: any) => {
    const step = authChain.find((s) => s.id === stepId)
    if (step && step.conditions) {
      const newConditions = step.conditions.map((cond, i) => (i === conditionIndex ? { ...cond, ...updates } : cond))
      updateAuthStep(stepId, { conditions: newConditions })
    }
  }

  const addNewStepCondition = () => {
    setNewStep({
      ...newStep,
      conditions: [...(newStep.conditions || []), { type: "risk", operator: "gte", value: "medium" }],
    })
  }

  const removeNewStepCondition = (index: number) => {
    setNewStep({
      ...newStep,
      conditions: newStep.conditions?.filter((_, i) => i !== index),
    })
  }

  const updateNewStepCondition = (index: number, updates: any) => {
    setNewStep({
      ...newStep,
      conditions: newStep.conditions?.map((cond, i) => (i === index ? { ...cond, ...updates } : cond)),
    })
  }

  const getUsedMethods = (currentStepId: string) => {
    return authChain.filter((s) => s.id !== currentStepId).map((s) => s.method)
  }

  const getAvailableMethods = (currentStepId: string) => {
    const used = getUsedMethods(currentStepId)
    return AUTH_METHODS.filter((m) => !used.includes(m.value))
  }

  const getOperators = (conditionType: string) => {
    if (conditionType === "risk") return RISK_OPERATORS
    return LOCATION_OPERATORS
  }

  const getValues = (conditionType: string) => {
    switch (conditionType) {
      case "risk":
        return [
          { value: "low", label: "낮음" },
          { value: "medium", label: "중간" },
          { value: "high", label: "높음" },
          { value: "critical", label: "매우 높음" },
        ]
      case "location":
        return trustedLocations.map((loc) => ({ value: loc.id, label: loc.name }))
      case "device":
        return trustedDevices.map((dev) => ({ value: dev.id, label: dev.name }))
      case "time":
        return trustedTimeRanges.map((time) => ({ value: time.id, label: time.name }))
      case "ip":
        return trustedIpRanges.map((ip) => ({ value: ip.id, label: ip.name }))
      default:
        return []
    }
  }

  const getMethodLabel = (value: string) => {
    return AUTH_METHODS.find((m) => m.value === value)?.label || value
  }

  const getModeLabel = (mode: string) => {
    return mode === "required" ? "항상 적용" : "조건부 적용"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              인증 체인 정책 (Adaptive MFA)
            </CardTitle>
            <CardDescription className="mt-2">
              다단계 인증 체인을 구성하여 보안 수준에 따라 유연한 인증 절차를 설정할 수 있습니다.
            </CardDescription>
          </div>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                인증 단계 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>새 인증 단계 추가</DialogTitle>
                <DialogDescription>
                  인증 체인에 추가할 인증 단계를 설정하세요. 단계는 순서대로 실행됩니다.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>단계 이름 (선택사항)</Label>
                    <input
                      type="text"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="예: 기본 인증, 추가 보안 인증"
                      value={newStep.name || ""}
                      onChange={(e) => setNewStep({ ...newStep, name: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">비워두면 인증 방식 이름이 자동으로 사용됩니다.</p>
                  </div>

                  <div className="space-y-2">
                    <Label>단계 설명 (선택사항)</Label>
                    <textarea
                      className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="이 인증 단계에 대한 설명을 입력하세요"
                      value={newStep.description || ""}
                      onChange={(e) => setNewStep({ ...newStep, description: e.target.value })}
                    />
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>인증 방식 *</Label>
                    <Select value={newStep.method} onValueChange={(value) => setNewStep({ ...newStep, method: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="인증 방식을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        {AUTH_METHODS.filter((m) => !getUsedMethods("").includes(m.value)).map((method) => (
                          <SelectItem key={method.value} value={method.value}>
                            <div className="flex flex-col items-start py-1">
                              <div className="font-medium">{method.label}</div>
                              <div className="text-xs text-muted-foreground">{method.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>적용 방식 *</Label>
                    <Select
                      value={newStep.mode}
                      onValueChange={(value: any) => {
                        const updates: any = { ...newStep, mode: value }
                        if (value === "conditional" && (!newStep.conditions || newStep.conditions.length === 0)) {
                          updates.conditions = [{ type: "risk", operator: "gte", value: "medium" }]
                        }
                        setNewStep(updates)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="적용 방식을 선택하세요" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="required">
                          <div className="flex flex-col items-start py-1">
                            <div className="font-medium">항상 적용</div>
                            <div className="text-xs text-muted-foreground">모든 사용자에게 이 인증을 요구합니다</div>
                          </div>
                        </SelectItem>
                        <SelectItem value="conditional">
                          <div className="flex flex-col items-start py-1">
                            <div className="font-medium">조건부 적용</div>
                            <div className="text-xs text-muted-foreground">특정 조건에서만 이 인증을 요구합니다</div>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {newStep.mode === "conditional" && (
                  <div className="space-y-4 rounded-lg border bg-muted/50 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base font-semibold">조건 설정</Label>
                        <p className="text-xs text-muted-foreground mt-1">
                          다음 조건 중 하나라도 충족되면 이 인증 단계가 요구됩니다.
                        </p>
                      </div>
                      <Button variant="outline" size="sm" onClick={addNewStepCondition}>
                        <Plus className="h-3 w-3 mr-1" />
                        조건 추가
                      </Button>
                    </div>

                    {newStep.conditions && newStep.conditions.length > 0 ? (
                      <div className="space-y-3">
                        <div className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 px-3 pb-2 text-xs font-medium text-muted-foreground">
                          <div>조건 유형</div>
                          <div>연산자</div>
                          <div>값</div>
                          <div className="w-9"></div>
                        </div>
                        {newStep.conditions.map((condition, index) => (
                          <div
                            key={index}
                            className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center bg-background p-3 rounded-md border"
                          >
                            <Select
                              value={condition.type}
                              onValueChange={(value) =>
                                updateNewStepCondition(index, {
                                  type: value,
                                  operator: value === "risk" ? "gte" : "in",
                                  value: value === "risk" ? "medium" : "",
                                })
                              }
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {CONDITION_TYPES.map((type) => (
                                  <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={condition.operator}
                              onValueChange={(value) => updateNewStepCondition(index, { operator: value })}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {getOperators(condition.type).map((op) => (
                                  <SelectItem key={op.value} value={op.value}>
                                    {op.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Select
                              value={condition.value}
                              onValueChange={(value) => updateNewStepCondition(index, { value })}
                            >
                              <SelectTrigger className="h-9">
                                <SelectValue placeholder="값 선택" />
                              </SelectTrigger>
                              <SelectContent>
                                {getValues(condition.type).map((val) => (
                                  <SelectItem key={val.value} value={val.value}>
                                    {val.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>

                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-9 w-9"
                              onClick={() => removeNewStepCondition(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 border-2 border-dashed rounded-md">
                        <AlertTriangle className="h-8 w-8 mx-auto text-amber-500 mb-2" />
                        <p className="text-sm text-muted-foreground">
                          조건을 추가하지 않으면 이 단계는 항상 적용됩니다.
                        </p>
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>
                    취소
                  </Button>
                  <Button onClick={addAuthStep} disabled={!newStep.method}>
                    단계 추가
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {authChain.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed rounded-lg">
            <Shield className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">인증 단계를 추가하여 다단계 인증을 구성하세요.</p>
            <p className="text-xs text-muted-foreground mt-2">
              여러 인증 방식을 조합하여 강력한 보안 체계를 구축할 수 있습니다.
            </p>
          </div>
        )}

        {authChain.map((step, index) => {
          const method = AUTH_METHODS.find((m) => m.value === step.method)
          return (
            <Card key={step.id} className="relative">
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="h-8 px-3">
                      단계 {index + 1}
                    </Badge>
                    {index < authChain.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => removeAuthStep(step.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-lg">{step.name || method?.label}</h4>
                    <Badge variant={step.mode === "required" ? "default" : "outline"}>{getModeLabel(step.mode)}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{step.description || method?.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>인증 방식</Label>
                    <Select value={step.method} onValueChange={(value) => updateAuthStep(step.id, { method: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getAvailableMethods(step.id).map((m) => (
                          <SelectItem key={m.value} value={m.value}>
                            {m.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>적용 방식</Label>
                    <Select
                      value={step.mode}
                      onValueChange={(value: any) => {
                        const updates: any = { mode: value }
                        if (value === "conditional" && !step.conditions) {
                          updates.conditions = [{ type: "risk", operator: "gte", value: "medium" }]
                        }
                        updateAuthStep(step.id, updates)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="required">항상 적용</SelectItem>
                        <SelectItem value="conditional">조건부 적용</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {step.mode === "conditional" && step.conditions && (
                  <div className="space-y-3 p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm font-semibold">조건 설정</Label>
                      <Button variant="outline" size="sm" onClick={() => addCondition(step.id)}>
                        <Plus className="h-3 w-3 mr-1" />
                        조건 추가
                      </Button>
                    </div>
                    {step.conditions.map((condition, condIndex) => (
                      <div
                        key={condIndex}
                        className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center bg-background p-3 rounded-md border"
                      >
                        <Select
                          value={condition.type}
                          onValueChange={(value) =>
                            updateCondition(step.id, condIndex, {
                              type: value,
                              operator: value === "risk" ? "gte" : "in",
                              value: value === "risk" ? "medium" : "",
                            })
                          }
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {CONDITION_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={condition.operator}
                          onValueChange={(value) => updateCondition(step.id, condIndex, { operator: value })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {getOperators(condition.type).map((op) => (
                              <SelectItem key={op.value} value={op.value}>
                                {op.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={condition.value}
                          onValueChange={(value) => updateCondition(step.id, condIndex, { value })}
                        >
                          <SelectTrigger className="h-9">
                            <SelectValue placeholder="값 선택" />
                          </SelectTrigger>
                          <SelectContent>
                            {getValues(condition.type).map((val) => (
                              <SelectItem key={val.value} value={val.value}>
                                {val.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Button variant="ghost" size="icon" onClick={() => removeCondition(step.id, condIndex)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </CardContent>
    </Card>
  )
}
