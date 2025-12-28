"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  CalendarIcon,
  Plus,
  X,
  Clock,
  Zap,
  AlertCircle,
  UserCircle,
  MapPin,
  Users,
  ChevronLeft,
  Bell,
} from "lucide-react"
import { format } from "date-fns"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AudienceSelector } from "@/components/admin/audience-selector"
import { BookingConstraintsConfig } from "@/components/admin/booking-constraints-config"
import { TimeRangePicker } from "@/components/admin/time-range-picker"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type {
  EventCategory,
  EventType,
  RecurrencePattern,
  TimeSlot,
  TargetAudience,
  BookingConstraints,
  EventDateConfig,
} from "@/types/event-types"

const mockAssignees = [
  { id: "prof-1", name: "김교수", role: "professor" as const, email: "kim@univ.edu" },
  { id: "prof-2", name: "이교수", role: "professor" as const, email: "lee@univ.edu" },
  { id: "prof-3", name: "박교수", role: "professor" as const, email: "park@univ.edu" },
  { id: "mentor-1", name: "최멘토", role: "mentor" as const, email: "choi@univ.edu" },
  { id: "staff-1", name: "정직원", role: "staff" as const, email: "jung@univ.edu" },
]

const mockProjects = [
  { id: "1", title: "2025 신입생 프로그램" },
  { id: "2", title: "교수 상담 시스템" },
  { id: "3", title: "스터디룸 관리" },
]

export default function CreateEventPage() {
  const router = useRouter()
  const [category, setCategory] = useState<EventCategory>("reservation")
  const [eventType, setEventType] = useState<EventType>("consultation")
  const [date, setDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()

  const [dateConfigs, setDateConfigs] = useState<EventDateConfig[]>([])
  const [currentDateConfig, setCurrentDateConfig] = useState<EventDateConfig | null>(null)

  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])

  const [autoGenerateMode, setAutoGenerateMode] = useState(false)
  const [autoStartTime, setAutoStartTime] = useState("09:00")
  const [autoEndTime, setAutoEndTime] = useState("18:00")
  const [sessionDuration, setSessionDuration] = useState("30")
  const [breakDuration, setBreakDuration] = useState("10")

  const [defaultLocation, setDefaultLocation] = useState("")

  const [recurrence, setRecurrence] = useState<RecurrencePattern>("none")
  const [recurrenceEndDate, setRecurrenceEndDate] = useState<Date>()
  const [selectedDays, setSelectedDays] = useState<number[]>([])

  const [requireSurvey, setRequireSurvey] = useState(false)
  const [requireDocuments, setRequireDocuments] = useState(false)
  const [documents, setDocuments] = useState<string[]>([])

  const [enableWaitlist, setEnableWaitlist] = useState(true)

  const [checkoutRequired, setCheckoutRequired] = useState(false)
  const [resourceName, setResourceName] = useState("")

  const [requiresApproval, setRequiresApproval] = useState(false)
  const [earlyBirdDeadline, setEarlyBirdDeadline] = useState<Date>()

  const [targetAudience, setTargetAudience] = useState<TargetAudience>({
    mode: "public",
  })

  const [bookingConstraints, setBookingConstraints] = useState<BookingConstraints>({
    allowMultipleSlotsPerDay: true,
    allowSameAssigneeBooking: true,
    preventOverlappingBookings: true,
  })

  const [viewingConfig, setViewingConfig] = useState<EventDateConfig | null>(null)
  const [defaultCapacity, setDefaultCapacity] = useState(1)

  const [selectedProject, setSelectedProject] = useState<string>("")

  const generateTimeSlots = () => {
    const slots: TimeSlot[] = []
    const start = new Date(`2024-01-01T${autoStartTime}:00`)
    const end = new Date(`2024-01-01T${autoEndTime}:00`)
    const session = Number.parseInt(sessionDuration)
    const breakTime = Number.parseInt(breakDuration)

    let current = start
    let slotId = 1

    while (current < end) {
      const slotEnd = new Date(current.getTime() + session * 60000)
      if (slotEnd > end) break

      slots.push({
        id: `slot-${slotId}`,
        startTime: current.toTimeString().slice(0, 5),
        endTime: slotEnd.toTimeString().slice(0, 5),
        capacity: defaultCapacity,
        assignees: [],
        location: defaultLocation,
      })

      current = new Date(slotEnd.getTime() + breakTime * 60000)
      slotId++
    }

    setTimeSlots(slots)
    setAutoGenerateMode(false)
  }

  const addTimeSlot = () => {
    const newSlot: TimeSlot = {
      id: `slot-${Date.now()}`,
      startTime: "09:00",
      endTime: "10:00",
      capacity: category === "reservation" ? 1 : 10,
      assignees: [],
      location: defaultLocation,
    }
    setTimeSlots([...timeSlots, newSlot])
  }

  const removeTimeSlot = (id: string) => {
    setTimeSlots(timeSlots.filter((slot) => slot.id !== id))
  }

  const updateTimeSlot = (id: string, updates: Partial<TimeSlot>) => {
    setTimeSlots(timeSlots.map((slot) => (slot.id === id ? { ...slot, ...updates } : slot)))
  }

  const addDateConfig = () => {
    if (!date) return

    const existingConfig = dateConfigs.find((config) => config.date.toDateString() === date.toDateString())

    if (existingConfig) {
      alert("이미 해당 날짜의 설정이 있습니다.")
      return
    }

    const newConfig: EventDateConfig = {
      date: date,
      timeSlots: [...timeSlots],
    }

    setDateConfigs([...dateConfigs, newConfig])
    setDate(undefined)
    setTimeSlots([])
  }

  const removeDateConfig = (configDate: Date) => {
    setDateConfigs(dateConfigs.filter((config) => config.date !== configDate))
  }

  const editDateConfig = (config: EventDateConfig) => {
    setDate(config.date)
    setTimeSlots([...config.timeSlots])
    removeDateConfig(config.date)
  }

  const handleSubmit = () => {
    console.log("[v0] Event created:", {
      category,
      eventType,
      dateConfigs,
      targetAudience,
      bookingConstraints,
      recurrence,
      selectedProject,
    })
    router.push("/admin/events")
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <h2 className="text-2xl font-semibold text-foreground">새 이벤트 생성</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              A
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto p-6 space-y-6 max-w-5xl pb-24">
        <div className="space-y-8">
          {/* Category Selection */}
          <Card>
            <CardHeader>
              <CardTitle>이벤트 카테고리</CardTitle>
              <CardDescription>이벤트 유형을 선택하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={category} onValueChange={(v) => setCategory(v as EventCategory)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="reservation">예약형</TabsTrigger>
                  <TabsTrigger value="resource">리소스</TabsTrigger>
                  <TabsTrigger value="registration">등록형</TabsTrigger>
                </TabsList>
              </Tabs>

              <div className="mt-4">
                <Label>세부 유형</Label>
                <Select value={eventType} onValueChange={(v) => setEventType(v as EventType)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {category === "reservation" && (
                      <>
                        <SelectItem value="consultation">교수 상담</SelectItem>
                        <SelectItem value="mentoring">멘토링</SelectItem>
                        <SelectItem value="career">경력 개발</SelectItem>
                      </>
                    )}
                    {category === "resource" && (
                      <>
                        <SelectItem value="study-room">스터디룸</SelectItem>
                        <SelectItem value="equipment">연구실 장비</SelectItem>
                      </>
                    )}
                    {category === "registration" && (
                      <>
                        <SelectItem value="session">행사 세션</SelectItem>
                        <SelectItem value="seminar">세미나/워크샵</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle>기본 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>
                  소속 프로젝트 <span className="text-destructive">*</span>
                </Label>
                <Select value={selectedProject} onValueChange={setSelectedProject}>
                  <SelectTrigger>
                    <SelectValue placeholder="이벤트가 속할 프로젝트를 선택하세요" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">프로젝트 없음 (독립 이벤트)</SelectItem>
                    {mockProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-1">
                  프로젝트에 포함하면 통합 통계와 분석을 제공받을 수 있습니다
                </p>
              </div>
              {/* </CHANGE> */}
              <div>
                <Label>이벤트 제목</Label>
                <Input placeholder="예: 2024학년도 1학기 교수 상담" />
              </div>
              <div>
                <Label>설명</Label>
                <Textarea placeholder="이벤트에 대한 자세한 설명을 입력하세요" />
              </div>
              <div>
                <Label>기본 장소</Label>
                <Input
                  placeholder="예: 공학관 302호"
                  value={defaultLocation}
                  onChange={(e) => setDefaultLocation(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Target Audience */}
          {category === "reservation" && (
            <Card>
              <CardHeader>
                <CardTitle>예약 대상</CardTitle>
                <CardDescription>이 이벤트를 예약할 수 있는 사용자를 지정하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <AudienceSelector value={targetAudience} onChange={setTargetAudience} />
              </CardContent>
            </Card>
          )}

          {/* Booking Constraints */}
          {category === "reservation" && (
            <Card>
              <CardHeader>
                <CardTitle>예약 제약 조건</CardTitle>
                <CardDescription>예약 시 적용될 규칙을 설정하세요</CardDescription>
              </CardHeader>
              <CardContent>
                <BookingConstraintsConfig value={bookingConstraints} onChange={setBookingConstraints} />
              </CardContent>
            </Card>
          )}

          {/* Time Slots Management */}
          <Card>
            <CardHeader>
              <CardTitle>타임 테이블 설정</CardTitle>
              <p className="text-sm text-muted-foreground">날짜별로 다른 타임 슬롯을 설정할 수 있습니다</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Date Selection */}
              <div className="space-y-2">
                <Label>날짜 선택</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "yyyy년 M월 d일") : "날짜를 선택하세요"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={date} onSelect={setDate} />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Default Capacity */}
              <div className="space-y-2">
                <Label>기본 정원</Label>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="number"
                    min="1"
                    value={defaultCapacity}
                    onChange={(e) => setDefaultCapacity(Number.parseInt(e.target.value) || 1)}
                    className="w-32"
                  />
                  <span className="text-sm text-muted-foreground">명</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  자동 생성되는 타임 슬롯의 기본 정원입니다. 개별 슬롯은 나중에 수정할 수 있습니다.
                </p>
              </div>

              {/* Auto Generate */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>타임 슬롯 자동 생성</Label>
                  <Switch checked={autoGenerateMode} onCheckedChange={setAutoGenerateMode} />
                </div>

                {autoGenerateMode && (
                  <div className="space-y-4 rounded-lg border p-4">
                    <div>
                      <Label>운영 시간</Label>
                      <TimeRangePicker
                        startTime={autoStartTime}
                        endTime={autoEndTime}
                        onChange={(start, end) => {
                          setAutoStartTime(start)
                          setAutoEndTime(end)
                        }}
                        placeholder="시작 - 종료 시간 선택"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>세션 시간 (분)</Label>
                        <Input
                          type="number"
                          value={sessionDuration}
                          onChange={(e) => setSessionDuration(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>휴식 시간 (분)</Label>
                        <Input type="number" value={breakDuration} onChange={(e) => setBreakDuration(e.target.value)} />
                      </div>
                    </div>
                    <Button onClick={generateTimeSlots} className="w-full">
                      <Zap className="mr-2 h-4 w-4" />
                      타임 슬롯 생성 (
                      {Math.floor(
                        (new Date(`2024-01-01T${autoEndTime}:00`).getTime() -
                          new Date(`2024-01-01T${autoStartTime}:00`).getTime()) /
                          ((Number.parseInt(sessionDuration) + Number.parseInt(breakDuration)) * 60000),
                      )}
                      개 예상)
                    </Button>
                  </div>
                )}
              </div>

              {/* Time Slots */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>타임 슬롯 ({timeSlots.length}개)</Label>
                  <Button size="sm" variant="outline" onClick={addTimeSlot}>
                    <Plus className="mr-2 h-4 w-4" />
                    슬롯 추가
                  </Button>
                </div>

                {timeSlots.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>타임 슬롯을 추가하거나 자동 생성하세요</AlertDescription>
                  </Alert>
                )}

                {timeSlots.length > 0 && (
                  <Accordion type="multiple" className="space-y-2 mb-8">
                    {timeSlots.map((slot, index) => (
                      <AccordionItem key={slot.id} value={slot.id} className="border border-b rounded-lg">
                        <div className="relative flex items-center">
                          <AccordionTrigger className="flex-1 px-4 pr-12 hover:no-underline [&>svg]:hidden">
                            <div className="flex items-center gap-3 w-full">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-sm">
                                {index + 1}
                              </div>
                              <div className="flex items-center gap-2 text-left">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span className="font-medium">
                                  {slot.startTime} - {slot.endTime}
                                </span>
                                {slot.assignees && slot.assignees.length > 0 && (
                                  <>
                                    <span className="text-muted-foreground">·</span>
                                    <span className="text-sm text-muted-foreground">{slot.assignees[0].name}</span>
                                  </>
                                )}
                                {slot.location && (
                                  <>
                                    <span className="text-muted-foreground">·</span>
                                    <MapPin className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-sm text-muted-foreground">{slot.location}</span>
                                  </>
                                )}
                                <span className="text-muted-foreground">·</span>
                                <Users className="h-3 w-3 text-muted-foreground" />
                                <span className="text-sm text-muted-foreground">{slot.capacity}명</span>
                              </div>
                            </div>
                          </AccordionTrigger>
                          <button
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center shrink-0 z-10"
                            onClick={(e) => {
                              e.stopPropagation()
                              removeTimeSlot(slot.id)
                            }}
                            type="button"
                            aria-label="타임슬롯 삭제"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>

                        {/* </CHANGE> */}
                        <AccordionContent className="px-4 pb-4">
                          <div className="space-y-3 pt-2">
                            <div>
                              <Label className="text-xs">시간 범위</Label>
                              <TimeRangePicker
                                startTime={slot.startTime}
                                endTime={slot.endTime}
                                onChange={(start, end) => {
                                  updateTimeSlot(slot.id, { startTime: start, endTime: end })
                                }}
                              />
                            </div>

                            {/* Capacity */}
                            <div>
                              <Label className="text-xs">정원</Label>
                              <div className="flex items-center gap-2">
                                <Users className="h-4 w-4 text-muted-foreground" />
                                <Input
                                  type="number"
                                  min="1"
                                  value={slot.capacity}
                                  onChange={(e) =>
                                    updateTimeSlot(slot.id, { capacity: Number.parseInt(e.target.value) || 1 })
                                  }
                                  className="w-32"
                                />
                                <span className="text-sm text-muted-foreground">명</span>
                              </div>
                            </div>

                            <div>
                              <Label className="text-xs">담당자</Label>
                              <Select
                                value={slot.assignees?.[0]?.id || ""}
                                onValueChange={(value) => {
                                  const assignee = mockAssignees.find((a) => a.id === value)
                                  if (assignee) {
                                    updateTimeSlot(slot.id, { assignees: [assignee] })
                                  }
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="담당자 선택" />
                                </SelectTrigger>
                                <SelectContent>
                                  {mockAssignees.map((assignee) => (
                                    <SelectItem key={assignee.id} value={assignee.id}>
                                      <div className="flex items-center gap-2">
                                        <UserCircle className="h-4 w-4" />
                                        {assignee.name} ({assignee.role})
                                      </div>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div>
                              <Label className="text-xs">장소</Label>
                              <Input
                                placeholder="장소 입력"
                                value={slot.location || ""}
                                onChange={(e) => updateTimeSlot(slot.id, { location: e.target.value })}
                              />
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </div>

              {/* Add Date Config */}
              {date && timeSlots.length > 0 && (
                <Button onClick={addDateConfig} className="w-full" variant="secondary">
                  <Plus className="mr-2 h-4 w-4" />
                  {format(date, "yyyy년 M월 d일")} 설정 저장
                </Button>
              )}

              {/* Saved Date Configs */}
              {dateConfigs.length > 0 && (
                <div className="space-y-2">
                  <Label>저장된 날짜별 설정</Label>
                  <div className="space-y-2">
                    {dateConfigs.map((config) => (
                      <div
                        key={config.date.toISOString()}
                        className="flex items-center justify-between rounded-lg border p-4"
                      >
                        <div>
                          <div className="font-medium">{format(config.date, "yyyy년 M월 d일")}</div>
                          <div className="text-sm text-muted-foreground">{config.timeSlots.length}개 타임 슬롯</div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => setViewingConfig(config)}>
                            상세 보기
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => editDateConfig(config)}>
                            수정
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => removeDateConfig(config.date)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Fixed Bottom Button Group */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:left-64">
        <div className="container mx-auto max-w-5xl p-4">
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => router.back()}>
              취소
            </Button>
            <Button onClick={handleSubmit}>이벤트 생성</Button>
          </div>
        </div>
      </div>

      {/* Detailed View Dialog */}
      <Dialog open={!!viewingConfig} onOpenChange={() => setViewingConfig(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{viewingConfig && format(viewingConfig.date, "yyyy년 M월 d일")} 상세 정보</DialogTitle>
            <DialogDescription>저장된 타임 슬롯 설정을 확인할 수 있습니다</DialogDescription>
          </DialogHeader>
          {viewingConfig && (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground">총 {viewingConfig.timeSlots.length}개의 타임 슬롯</div>
              <div className="space-y-3">
                {viewingConfig.timeSlots.map((slot, index) => (
                  <div key={slot.id} className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary font-medium text-xs">
                        {index + 1}
                      </div>
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {slot.startTime} - {slot.endTime}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm pl-8">
                      <div>
                        <span className="text-muted-foreground">담당자:</span> {slot.assignees?.[0]?.name || "미지정"}
                      </div>
                      <div>
                        <span className="text-muted-foreground">정원:</span> {slot.capacity}명
                      </div>
                      {slot.location && (
                        <div className="col-span-2">
                          <span className="text-muted-foreground">장소:</span> {slot.location}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
