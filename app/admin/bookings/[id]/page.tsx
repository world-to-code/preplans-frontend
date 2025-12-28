"use client"

import { useRouter } from "next/router"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import {
  ArrowLeft,
  Bell,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Trash2,
  User,
  Calendar,
  Clock,
  FileText,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function BookingDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Mock booking data - would come from database
  const booking = {
    id: params.id,
    student: "김민수",
    studentId: "2021123456",
    studentEmail: "minsu.kim@university.edu",
    event: "Machine Learning Fundamentals",
    eventId: "1",
    professor: "Dr. Sarah Kim",
    date: "2025-01-20",
    time: "14:00",
    duration: 60,
    location: "공학관 301호",
    status: "confirmed" as const,
    attended: null as boolean | null,
    notes: "AI 프로젝트 주제 상담 요청",
    createdAt: "2025-01-15 10:30",
    projectName: "2025 Spring AI Workshop Series",
  }

  const handleMarkAttended = () => {
    alert(`예약 #${booking.id}를 출석으로 표시했습니다.`)
    router.refresh()
  }

  const handleMarkNoShow = () => {
    alert(`예약 #${booking.id}를 결석으로 표시했습니다.`)
    router.refresh()
  }

  const handleReschedule = () => {
    alert(`예약 일정 변경 기능은 개발 중입니다.`)
  }

  const handleCancel = () => {
    if (confirm("이 예약을 취소하시겠습니까?")) {
      alert(`예약 #${booking.id}가 취소되었습니다.`)
      router.push("/admin/bookings")
    }
  }

  const handleSendReminder = () => {
    alert(`${booking.student}에게 알림을 전송했습니다.`)
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">예약 상세</h2>
              <p className="text-sm text-muted-foreground">예약 ID: {booking.id}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={handleSendReminder}>
              <Bell className="mr-2 h-4 w-4" />
              알림 보내기
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleReschedule}>
                  <Calendar className="mr-2 h-4 w-4" />
                  일정 변경
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkAttended}>
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  출석으로 표시
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleMarkNoShow}>
                  <XCircle className="mr-2 h-4 w-4" />
                  결석으로 표시
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={handleCancel}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  예약 취소
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        {/* Status Badge */}
        <div className="flex items-center gap-3">
          <Badge
            variant={
              booking.status === "confirmed" ? "default" : booking.status === "pending" ? "secondary" : "outline"
            }
            className="text-sm"
          >
            {booking.status === "confirmed" ? "확정" : booking.status === "pending" ? "대기중" : "취소"}
          </Badge>
          {booking.attended !== null && (
            <Badge variant={booking.attended ? "default" : "destructive"}>{booking.attended ? "출석" : "결석"}</Badge>
          )}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Student Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                학생 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">이름</p>
                <p className="font-medium">{booking.student}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">학번</p>
                <p className="font-medium">{booking.studentId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">이메일</p>
                <p className="font-medium">{booking.studentEmail}</p>
              </div>
            </CardContent>
          </Card>

          {/* Event Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                이벤트 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">이벤트</p>
                <p className="font-medium">{booking.event}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">담당 교수</p>
                <p className="font-medium">{booking.professor}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">프로젝트</p>
                <p className="font-medium">{booking.projectName}</p>
              </div>
            </CardContent>
          </Card>

          {/* Schedule Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                일정 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">날짜</p>
                <p className="font-medium">{booking.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">시간</p>
                <p className="font-medium">
                  {booking.time} ({booking.duration}분)
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">장소</p>
                <p className="font-medium">{booking.location}</p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                추가 정보
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">예약 시간</p>
                <p className="font-medium">{booking.createdAt}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">참고사항</p>
                <p className="font-medium">{booking.notes || "없음"}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        {booking.attended === null && (
          <Card>
            <CardHeader>
              <CardTitle>출석 체크</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-3">
              <Button onClick={handleMarkAttended} className="flex-1">
                <CheckCircle2 className="mr-2 h-4 w-4" />
                출석으로 표시
              </Button>
              <Button onClick={handleMarkNoShow} variant="outline" className="flex-1 bg-transparent">
                <XCircle className="mr-2 h-4 w-4" />
                결석으로 표시
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
