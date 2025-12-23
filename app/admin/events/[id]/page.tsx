"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit,
  Copy,
  Trash2,
  CheckCircle,
  XCircle,
  MoreVertical,
} from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function EventDetailPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params.id as string

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  // Mock data - would come from API based on eventId
  const event = {
    id: eventId,
    title: "교수 상담",
    type: "reservation",
    professor: "김교수",
    category: "논문",
    department: "컴퓨터공학과",
    date: "2025년 1월 15일",
    location: "공학관 301호",
    description:
      "논문 지도를 위한 개별 상담 세션입니다. 연구 주제, 방법론, 진행 상황 등에 대해 논의할 수 있습니다. 학생들은 자신의 연구 주제와 방법론에 대해 논의하고 피드백을 받을 수 있습니다.",
    duration: 30,
    capacity: 1,
    status: "active",
    totalSlots: 20,
    bookedSlots: 12,
    waitlist: 2,
  }

  const bookings = [
    { id: 1, student: "김민수", studentId: "2021001", time: "09:00", status: "confirmed", attended: true },
    { id: 2, student: "이지은", studentId: "2021002", time: "09:30", status: "confirmed", attended: true },
    { id: 3, student: "박준형", studentId: "2021003", time: "10:00", status: "confirmed", attended: null },
    { id: 4, student: "최서연", studentId: "2021004", time: "10:30", status: "confirmed", attended: null },
    { id: 5, student: "정하은", studentId: "2021005", time: "11:00", status: "confirmed", attended: null },
  ]

  const availableSlots = [
    { id: 1, time: "11:30", date: "2025-01-15", available: true },
    { id: 2, time: "13:00", date: "2025-01-15", available: true },
    { id: 3, time: "13:30", date: "2025-01-15", available: true },
  ]

  const waitlistStudents = [
    { id: 1, student: "강지호", studentId: "2021006", position: 1, requestedTime: "09:00" },
    { id: 2, student: "윤서아", studentId: "2021007", position: 2, requestedTime: "10:00" },
  ]

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "reservation":
        return "예약형"
      case "registration":
        return "등록형"
      case "resource":
        return "리소스"
      default:
        return type
    }
  }

  const handleEdit = () => {
    router.push(`/admin/events/${eventId}/edit`)
  }

  const handleDuplicate = () => {
    console.log("[v0] Duplicate event:", eventId)
    alert(`이벤트 #${eventId}를 복제합니다.`)
  }

  const handleDeleteConfirm = () => {
    console.log("[v0] Delete event:", eventId)
    alert(`이벤트 #${eventId}를 삭제합니다.`)
    setDeleteDialogOpen(false)
    router.push("/admin/events")
  }

  const handleMarkAttended = (bookingId: number) => {
    console.log("[v0] Mark attended:", bookingId)
    alert(`예약 #${bookingId}를 출석으로 표시합니다.`)
  }

  const handleMarkNoShow = (bookingId: number) => {
    console.log("[v0] Mark no-show:", bookingId)
    alert(`예약 #${bookingId}를 결석으로 표시합니다.`)
  }

  const handleBlockSlot = (slotId: number) => {
    console.log("[v0] Block slot:", slotId)
    alert(`슬롯 #${slotId}를 차단합니다.`)
  }

  const handleAssignSlot = (studentId: number) => {
    console.log("[v0] Assign slot to student:", studentId)
    alert(`학생 #${studentId}에게 슬롯을 배정합니다.`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">{event.title}</h1>
                <Badge variant="default">{getTypeLabel(event.type)}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">이벤트 ID: {event.id}</p>
            </div>
          </div>

          {/* Action Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreVertical className="h-4 w-4 mr-2" />
                작업
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                수정
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicate}>
                <Copy className="mr-2 h-4 w-4" />
                복제
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDialogOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Event Overview Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">이벤트 상세 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <div className="flex items-center gap-3 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">담당자:</span>
                <span className="font-medium">{event.professor}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">날짜:</span>
                <span className="font-medium">{event.date}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">장소:</span>
                <span className="font-medium">{event.location}</span>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">소요 시간:</span>
                <span className="font-medium">{event.duration}분</span>
              </div>
            </div>
            <Separator />
            <div>
              <p className="text-sm font-medium mb-2">설명</p>
              <p className="text-sm text-muted-foreground">{event.description}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-foreground">{event.bookedSlots}</p>
                <p className="text-xs text-muted-foreground">예약됨</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{event.totalSlots - event.bookedSlots}</p>
                <p className="text-xs text-muted-foreground">예약 가능</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{event.waitlist}</p>
                <p className="text-xs text-muted-foreground">대기 중</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for Bookings, Slots, Waitlist */}
        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="bookings">예약 ({bookings.length})</TabsTrigger>
            <TabsTrigger value="slots">예약 가능 ({availableSlots.length})</TabsTrigger>
            <TabsTrigger value="waitlist">대기 목록 ({waitlistStudents.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-3 mt-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{booking.student[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{booking.student}</p>
                      <p className="text-sm text-muted-foreground">
                        {booking.time} • {booking.studentId}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {booking.attended === null ? (
                      <>
                        <Button variant="outline" size="sm" onClick={() => handleMarkAttended(booking.id)}>
                          <CheckCircle className="mr-1 h-3 w-3" />
                          출석
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleMarkNoShow(booking.id)}>
                          <XCircle className="mr-1 h-3 w-3" />
                          결석
                        </Button>
                      </>
                    ) : booking.attended ? (
                      <Badge variant="default" className="bg-green-600">
                        출석
                      </Badge>
                    ) : (
                      <Badge variant="destructive">결석</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="slots" className="space-y-3 mt-4">
            {availableSlots.map((slot) => (
              <Card key={slot.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{slot.time}</p>
                    <p className="text-sm text-muted-foreground">예약 가능</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleBlockSlot(slot.id)}>
                    슬롯 차단
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="waitlist" className="space-y-3 mt-4">
            {waitlistStudents.map((student) => (
              <Card key={student.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted text-sm font-medium">
                      #{student.position}
                    </div>
                    <div>
                      <p className="font-medium">{student.student}</p>
                      <p className="text-sm text-muted-foreground">
                        희망 시간: {student.requestedTime} • {student.studentId}
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => handleAssignSlot(student.id)}>
                    슬롯 배정
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>이벤트를 삭제하시겠습니까?</AlertDialogTitle>
            <AlertDialogDescription>
              이 작업은 되돌릴 수 없습니다. 이벤트와 관련된 모든 예약 정보가 영구적으로 삭제됩니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              삭제
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
