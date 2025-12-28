"use client"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"

export default function EditBookingPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  // Mock booking data
  const [date, setDate] = useState("2025-01-20")
  const [time, setTime] = useState("14:00")
  const [duration, setDuration] = useState("60")
  const [location, setLocation] = useState("공학관 301호")
  const [notes, setNotes] = useState("AI 프로젝트 주제 상담 요청")
  const [status, setStatus] = useState("confirmed")

  const handleSave = () => {
    alert("예약이 수정되었습니다.")
    router.push(`/admin/bookings/${params.id}`)
  }

  return (
    <div className="flex-1">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur">
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h2 className="text-2xl font-semibold text-foreground">예약 수정</h2>
              <p className="text-sm text-muted-foreground">예약 ID: {params.id}</p>
            </div>
          </div>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            저장
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-6 max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>예약 정보 수정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="date">날짜</Label>
                <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="time">시간</Label>
                <Input id="time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="duration">소요 시간 (분)</Label>
                <Input id="duration" type="number" value={duration} onChange={(e) => setDuration(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">상태</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="confirmed">확정</SelectItem>
                    <SelectItem value="pending">대기중</SelectItem>
                    <SelectItem value="cancelled">취소</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">장소</Label>
              <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">참고사항</Label>
              <Textarea id="notes" rows={4} value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
