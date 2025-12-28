"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Calendar, Plus, Search, Filter, MoreVertical, Users, MapPin, Clock, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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

export default function EventsPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const mockEvents = [
    {
      id: 1,
      title: "교수 상담",
      type: "reservation",
      date: "2025년 1월 15일",
      participants: 12,
      capacity: 20,
      location: "공학관 301호",
      status: "active",
    },
    {
      id: 2,
      title: "신입생 오리엔테이션",
      type: "registration",
      date: "2025년 2월 1일",
      participants: 145,
      capacity: 200,
      location: "대강당",
      status: "active",
    },
    {
      id: 3,
      title: "스터디룸 예약",
      type: "resource",
      date: "진행중",
      participants: 34,
      capacity: 50,
      location: "도서관 3층",
      status: "active",
    },
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

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case "reservation":
        return "default"
      case "registration":
        return "secondary"
      case "resource":
        return "outline"
      default:
        return "default"
    }
  }

  const handleEdit = (eventId: number) => {
    console.log("[v0] Edit event:", eventId)
    router.push(`/admin/events/${eventId}/edit`)
  }

  const handleDuplicate = (eventId: number) => {
    console.log("[v0] Duplicate event:", eventId)
    // TODO: Implement duplicate logic
    alert(`이벤트 #${eventId}를 복제합니다.`)
  }

  const handleDeleteClick = (eventId: number) => {
    setSelectedEventId(eventId)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = () => {
    console.log("[v0] Delete event:", selectedEventId)
    // TODO: Implement delete logic
    alert(`이벤트 #${selectedEventId}를 삭제합니다.`)
    setDeleteDialogOpen(false)
    setSelectedEventId(null)
  }

  const handleViewDetails = (eventId: number) => {
    router.push(`/admin/events/${eventId}`)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Calendar className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">이벤트 관리</h1>
                  <p className="text-sm text-muted-foreground">모든 이벤트를 관리하고 새 이벤트를 생성하세요</p>
                </div>
              </div>
            </div>
          </div>
          <Link href="/admin/events/create">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              이벤트 생성
            </Button>
          </Link>
          {/* </CHANGE> */}
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="이벤트 검색..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                필터
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Events List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mockEvents.map((event) => (
            <Card key={event.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <Badge variant={getTypeBadgeVariant(event.type)}>{getTypeLabel(event.type)}</Badge>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(event.id)}>수정</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(event.id)}>복제</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteClick(event.id)}>
                        삭제
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {event.date}
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  {event.location}
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{event.participants}</span>
                  <span className="text-muted-foreground">/ {event.capacity}</span>
                </div>
                <div className="pt-2">
                  <Button
                    variant="outline"
                    className="w-full bg-transparent"
                    onClick={() => handleViewDetails(event.id)}
                  >
                    상세 보기
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

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
