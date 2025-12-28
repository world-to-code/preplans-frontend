"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Search,
  Filter,
  Download,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Bell,
  CalendarIcon,
  Users,
  TrendingUp,
  AlertCircle,
} from "lucide-react"
import { format } from "date-fns"
import { ko } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"

const allBookings = [
  {
    id: 1,
    student: "김민수",
    studentEmail: "minsu@university.edu",
    event: "Machine Learning Fundamentals",
    professor: "Dr. Sarah Kim",
    date: "2025-01-20 14:00",
    status: "confirmed" as const,
    attended: null as boolean | null,
    project: "AI 워크샵 시리즈",
    location: "공학관 301호",
  },
  {
    id: 2,
    student: "이서연",
    studentEmail: "seoyeon@university.edu",
    event: "Research Methodology Workshop",
    professor: "Prof. Michael Chen",
    date: "2025-01-22 10:00",
    status: "pending" as const,
    attended: null as boolean | null,
    project: "연구 방법론 세미나",
    location: "대강당",
  },
  {
    id: 3,
    student: "박지훈",
    studentEmail: "jihoon@university.edu",
    event: "Career Counseling Session",
    professor: "Dr. Emily Park",
    date: "2025-01-18 15:30",
    status: "confirmed" as const,
    attended: true,
    project: "진로 상담 프로그램",
    location: "상담실 A",
  },
  {
    id: 4,
    student: "최수진",
    studentEmail: "sujin@university.edu",
    event: "Thesis Proposal Review",
    professor: "Prof. David Lee",
    date: "2025-01-25 11:00",
    status: "confirmed" as const,
    attended: null as boolean | null,
    project: "논문 지도",
    location: "교수연구실 205",
  },
  {
    id: 5,
    student: "정민호",
    studentEmail: "minho@university.edu",
    event: "Data Science Workshop",
    professor: "Dr. Sarah Kim",
    date: "2025-01-19 09:00",
    status: "cancelled" as const,
    attended: false,
    project: "데이터 과학 특강",
    location: "컴퓨터실 B",
  },
  {
    id: 6,
    student: "한소영",
    studentEmail: "soyoung@university.edu",
    event: "Office Hours",
    professor: "Prof. Michael Chen",
    date: "2025-01-21 16:00",
    status: "waitlist" as const,
    attended: null as boolean | null,
    project: "정규 상담 시간",
    location: "교수연구실 103",
  },
]

export default function BookingsPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [bookings, setBookings] = useState(allBookings)
  const [selectedBooking, setSelectedBooking] = useState<number | null>(null)
  const [rescheduleDialogOpen, setRescheduleDialogOpen] = useState(false)
  const [rescheduleDate, setRescheduleDate] = useState<Date>()

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    attended: bookings.filter((b) => b.attended === true).length,
  }

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.student.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.event.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.professor.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleMarkAttended = (id: number, attended: boolean) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, attended } : b)))
    toast({
      title: attended ? "출석 처리 완료" : "불참 처리 완료",
      description: `예약 #${id}의 출석 상태가 업데이트되었습니다.`,
    })
  }

  const handleCancelBooking = (id: number) => {
    setBookings(bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" as const } : b)))
    toast({
      title: "예약 취소 완료",
      description: `예약 #${id}가 취소되었습니다.`,
      variant: "destructive",
    })
  }

  const handleReschedule = (id: number) => {
    setSelectedBooking(id)
    setRescheduleDialogOpen(true)
  }

  const confirmReschedule = () => {
    if (!rescheduleDate || !selectedBooking) return

    const formattedDate = format(rescheduleDate, "yyyy-MM-dd HH:mm", { locale: ko })
    setBookings(bookings.map((b) => (b.id === selectedBooking ? { ...b, date: formattedDate } : b)))

    toast({
      title: "일정 변경 완료",
      description: `예약 #${selectedBooking}의 날짜가 ${format(rescheduleDate, "PPP", { locale: ko })}로 변경되었습니다.`,
    })

    setRescheduleDialogOpen(false)
    setSelectedBooking(null)
    setRescheduleDate(undefined)
  }

  const handleExportCSV = () => {
    const headers = ["ID", "학생", "이메일", "이벤트", "교수", "날짜", "상태", "출석", "프로젝트", "장소"]
    const rows = filteredBookings.map((b) => [
      b.id,
      b.student,
      b.studentEmail,
      b.event,
      b.professor,
      b.date,
      b.status,
      b.attended === null ? "미확인" : b.attended ? "출석" : "불참",
      b.project,
      b.location,
    ])

    const csvContent = [headers, ...rows].map((row) => row.join(",")).join("\n")
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `bookings_export_${format(new Date(), "yyyy-MM-dd")}.csv`
    link.click()

    toast({
      title: "내보내기 완료",
      description: `${filteredBookings.length}개의 예약이 CSV로 내보내졌습니다.`,
    })
  }

  const handleViewDetails = (id: number) => {
    router.push(`/admin/bookings/${id}`)
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
        <div className="flex h-16 items-center justify-between px-6">
          <div>
            <h2 className="text-2xl font-semibold text-foreground">예약 관리</h2>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
              A
            </div>
          </div>
        </div>
      </header>

      <div className="p-6 space-y-6">
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>전체 예약</CardDescription>
              <CardTitle className="text-3xl">{stats.total}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Users className="h-3 w-3" />총 예약 건수
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>확정 예약</CardDescription>
              <CardTitle className="text-3xl">{stats.confirmed}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <CheckCircle2 className="h-3 w-3" />
                {((stats.confirmed / stats.total) * 100).toFixed(0)}% 확정율
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>대기중</CardDescription>
              <CardTitle className="text-3xl">{stats.pending}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                승인 대기
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>출석 완료</CardDescription>
              <CardTitle className="text-3xl">{stats.attended}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                출석률 {stats.confirmed > 0 ? ((stats.attended / stats.confirmed) * 100).toFixed(0) : 0}%
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Booking Management Toolbar */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 items-center gap-2">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="학생, 이벤트, 교수 검색..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="상태" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체 상태</SelectItem>
                  <SelectItem value="confirmed">확정</SelectItem>
                  <SelectItem value="pending">대기중</SelectItem>
                  <SelectItem value="waitlist">대기자 명단</SelectItem>
                  <SelectItem value="cancelled">취소됨</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
                <span className="sr-only">고급 필터</span>
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="mr-2 h-4 w-4" />
                내보내기
              </Button>
            </div>
          </div>

          {/* Bookings Table */}
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-border bg-muted/50">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-medium text-foreground">학생</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-foreground">이벤트</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-foreground">교수</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-foreground">날짜 & 시간</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-foreground">상태</th>
                      <th className="px-6 py-4 text-left text-sm font-medium text-foreground">출석</th>
                      <th className="px-6 py-4 text-right text-sm font-medium text-foreground">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                          검색 결과가 없습니다.
                        </td>
                      </tr>
                    ) : (
                      filteredBookings.map((booking) => (
                        <tr key={booking.id} className="border-b border-border last:border-0 hover:bg-muted/50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-foreground">{booking.student}</p>
                            <p className="text-xs text-muted-foreground">{booking.studentEmail}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground">{booking.event}</p>
                            <p className="text-xs text-muted-foreground">{booking.project}</p>
                          </td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{booking.professor}</td>
                          <td className="px-6 py-4">
                            <p className="text-sm text-foreground">{booking.date}</p>
                            <p className="text-xs text-muted-foreground">{booking.location}</p>
                          </td>
                          <td className="px-6 py-4">
                            <Badge
                              variant={
                                booking.status === "confirmed"
                                  ? "default"
                                  : booking.status === "pending"
                                    ? "secondary"
                                    : booking.status === "waitlist"
                                      ? "outline"
                                      : "destructive"
                              }
                            >
                              {booking.status === "confirmed"
                                ? "확정"
                                : booking.status === "pending"
                                  ? "대기중"
                                  : booking.status === "waitlist"
                                    ? "대기자"
                                    : "취소"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4">
                            {booking.attended === null ? (
                              <span className="text-sm text-muted-foreground">-</span>
                            ) : booking.attended ? (
                              <Badge variant="default" className="bg-green-600">
                                <CheckCircle2 className="mr-1 h-3 w-3" />
                                출석
                              </Badge>
                            ) : (
                              <Badge variant="destructive">
                                <XCircle className="mr-1 h-3 w-3" />
                                불참
                              </Badge>
                            )}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                  <span className="sr-only">작업</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleViewDetails(booking.id)}>
                                  상세 보기
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleMarkAttended(booking.id, true)}>
                                  출석으로 표시
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleMarkAttended(booking.id, false)}>
                                  불참으로 표시
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleReschedule(booking.id)}>
                                  일정 변경
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => handleCancelBooking(booking.id)}
                                >
                                  예약 취소
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={rescheduleDialogOpen} onOpenChange={setRescheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>일정 변경</DialogTitle>
            <DialogDescription>예약 #{selectedBooking}의 새로운 날짜를 선택하세요.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>새 날짜</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal bg-transparent">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {rescheduleDate ? format(rescheduleDate, "PPP", { locale: ko }) : "날짜 선택"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={rescheduleDate} onSelect={setRescheduleDate} />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialogOpen(false)}>
              취소
            </Button>
            <Button onClick={confirmReschedule} disabled={!rescheduleDate}>
              변경 확인
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
