"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { User, Mail, Shield, Key, Smartphone, Bell } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function SettingsPage() {
  const { toast } = useToast()
  const [showPassword, setShowPassword] = useState(false)
  const [showTotpDialog, setShowTotpDialog] = useState(false)
  const [showFidoDialog, setShowFidoDialog] = useState(false)
  const [isAdmin, setIsAdmin] = useState(true) // Mock: 현재 사용자가 관리자인지 여부

  // 개인 정보
  const [profile, setProfile] = useState({
    name: "김관리자",
    email: "admin@university.edu",
    phone: "010-1234-5678",
    department: "전산팀",
    position: "관리자",
  })

  // MFA 설정
  const [mfaSettings, setMfaSettings] = useState({
    totpEnabled: true,
    fidoEnabled: false,
    emailVerification: true,
    trustedDevices: 3,
  })

  // 알림 설정
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bookingReminders: true,
    eventUpdates: true,
    surveyAlerts: false,
  })

  const handleSaveProfile = () => {
    toast({
      title: "프로필 업데이트 완료",
      description: "개인 정보가 성공적으로 업데이트되었습니다.",
    })
  }

  const handleEnrollTOTP = () => {
    setShowTotpDialog(true)
  }

  const handleEnrollFIDO = () => {
    setShowFidoDialog(true)
  }

  const handleSaveMFA = () => {
    toast({
      title: "MFA 설정 저장 완료",
      description: "다단계 인증 설정이 업데이트되었습니다.",
    })
  }

  const handleSaveNotifications = () => {
    toast({
      title: "알림 설정 저장 완료",
      description: "알림 설정이 업데이트되었습니다.",
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">설정</h1>
        <p className="text-muted-foreground mt-2">개인 정보 및 시스템 설정을 관리합니다</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 gap-4">
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            개인 정보
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            보안 및 MFA
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="h-4 w-4 mr-2" />
            알림
          </TabsTrigger>
        </TabsList>

        {/* 개인 정보 탭 */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>프로필 정보</CardTitle>
              <CardDescription>기본 개인 정보를 관리합니다</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" />
                  <AvatarFallback className="text-2xl">김관</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline" size="sm">
                    사진 변경
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">JPG, PNG 또는 GIF (최대 2MB)</p>
                </div>
              </div>

              <Separator />

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">이름</Label>
                  <Input
                    id="name"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">이메일</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">전화번호</Label>
                  <Input
                    id="phone"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">부서</Label>
                  <Input
                    id="department"
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">직책</Label>
                  <Input
                    id="position"
                    value={profile.position}
                    onChange={(e) => setProfile({ ...profile, position: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline">취소</Button>
                <Button onClick={handleSaveProfile}>변경사항 저장</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>비밀번호 변경</CardTitle>
              <CardDescription>보안을 위해 정기적으로 비밀번호를 변경하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current-password">현재 비밀번호</Label>
                <Input id="current-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">새 비밀번호</Label>
                <Input id="new-password" type="password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password">비밀번호 확인</Label>
                <Input id="confirm-password" type="password" />
              </div>

              <div className="flex justify-end">
                <Button>비밀번호 변경</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 보안 및 MFA 탭 */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>다단계 인증 (MFA)</CardTitle>
              <CardDescription>계정 보안을 강화하기 위해 추가 인증 방법을 설정하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* TOTP */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Smartphone className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">TOTP 인증</h3>
                      {mfaSettings.totpEnabled && <Badge variant="default">활성화됨</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Google Authenticator, Authy 등의 앱을 사용한 시간 기반 일회용 비밀번호
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={mfaSettings.totpEnabled}
                    onCheckedChange={(checked) => setMfaSettings({ ...mfaSettings, totpEnabled: checked })}
                  />
                  {mfaSettings.totpEnabled ? (
                    <Button variant="outline" size="sm" onClick={handleEnrollTOTP}>
                      재설정
                    </Button>
                  ) : (
                    <Button size="sm" onClick={handleEnrollTOTP}>
                      등록
                    </Button>
                  )}
                </div>
              </div>

              {/* FIDO/WebAuthn */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Key className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">FIDO/WebAuthn</h3>
                      {mfaSettings.fidoEnabled && <Badge variant="default">활성화됨</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">생체 인증 또는 보안 키를 사용한 패스키 인증</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={mfaSettings.fidoEnabled}
                    onCheckedChange={(checked) => setMfaSettings({ ...mfaSettings, fidoEnabled: checked })}
                  />
                  <Button
                    size="sm"
                    variant={mfaSettings.fidoEnabled ? "outline" : "default"}
                    onClick={handleEnrollFIDO}
                  >
                    {mfaSettings.fidoEnabled ? "관리" : "등록"}
                  </Button>
                </div>
              </div>

              {/* 이메일 인증 */}
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold">이메일 인증</h3>
                      {mfaSettings.emailVerification && <Badge variant="default">활성화됨</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">이메일로 전송된 코드를 사용한 인증</p>
                  </div>
                </div>
                <Switch
                  checked={mfaSettings.emailVerification}
                  onCheckedChange={(checked) => setMfaSettings({ ...mfaSettings, emailVerification: checked })}
                />
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold mb-4">신뢰하는 디바이스</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">MacBook Pro</p>
                      <p className="text-sm text-muted-foreground">마지막 사용: 5분 전</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      삭제
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">iPhone 14</p>
                      <p className="text-sm text-muted-foreground">마지막 사용: 2시간 전</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      삭제
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveMFA}>변경사항 저장</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>로그인 활동</CardTitle>
              <CardDescription>최근 계정 활동 내역을 확인하세요</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border-b">
                  <div>
                    <p className="font-medium">서울, 대한민국</p>
                    <p className="text-sm text-muted-foreground">2024년 1월 15일 14:32 - Chrome on macOS</p>
                  </div>
                  <Badge variant="default">현재 세션</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border-b">
                  <div>
                    <p className="font-medium">서울, 대한민국</p>
                    <p className="text-sm text-muted-foreground">2024년 1월 15일 09:15 - Safari on iOS</p>
                  </div>
                  <Badge variant="secondary">성공</Badge>
                </div>
                <div className="flex items-center justify-between p-3 border-b">
                  <div>
                    <p className="font-medium">서울, 대한민국</p>
                    <p className="text-sm text-muted-foreground">2024년 1월 14일 18:42 - Chrome on macOS</p>
                  </div>
                  <Badge variant="secondary">성공</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 알림 탭 */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>알림 설정</CardTitle>
              <CardDescription>받고 싶은 알림을 선택하세요</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">이메일 알림</Label>
                  <p className="text-sm text-muted-foreground">이메일로 알림을 받습니다</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, emailNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">푸시 알림</Label>
                  <p className="text-sm text-muted-foreground">브라우저 푸시 알림을 받습니다</p>
                </div>
                <Switch
                  id="push-notifications"
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, pushNotifications: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="booking-reminders">예약 리마인더</Label>
                  <p className="text-sm text-muted-foreground">예약 시간 전에 알림을 받습니다</p>
                </div>
                <Switch
                  id="booking-reminders"
                  checked={notifications.bookingReminders}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, bookingReminders: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="event-updates">이벤트 업데이트</Label>
                  <p className="text-sm text-muted-foreground">이벤트 변경사항에 대한 알림을 받습니다</p>
                </div>
                <Switch
                  id="event-updates"
                  checked={notifications.eventUpdates}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, eventUpdates: checked })}
                />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="survey-alerts">설문조사 알림</Label>
                  <p className="text-sm text-muted-foreground">새 설문조사 알림을 받습니다</p>
                </div>
                <Switch
                  id="survey-alerts"
                  checked={notifications.surveyAlerts}
                  onCheckedChange={(checked) => setNotifications({ ...notifications, surveyAlerts: checked })}
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSaveNotifications}>변경사항 저장</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* TOTP 등록 다이얼로그 */}
      <Dialog open={showTotpDialog} onOpenChange={setShowTotpDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>TOTP 인증 등록</DialogTitle>
            <DialogDescription>인증 앱으로 QR 코드를 스캔하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center p-6 border rounded-lg bg-muted">
              <div className="h-48 w-48 bg-white flex items-center justify-center">
                <p className="text-sm text-muted-foreground">[QR 코드]</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>또는 수동으로 입력</Label>
              <Input value="JBSWY3DPEHPK3PXP" readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totp-code">인증 코드 입력</Label>
              <Input id="totp-code" placeholder="6자리 코드" maxLength={6} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowTotpDialog(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                setShowTotpDialog(false)
                toast({
                  title: "TOTP 등록 완료",
                  description: "인증 앱이 성공적으로 등록되었습니다.",
                })
              }}
            >
              등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* FIDO 등록 다이얼로그 */}
      <Dialog open={showFidoDialog} onOpenChange={setShowFidoDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>FIDO/WebAuthn 등록</DialogTitle>
            <DialogDescription>생체 인증 또는 보안 키를 등록하세요</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-8 border rounded-lg bg-muted text-center">
              <Key className="h-16 w-16 mx-auto mb-4 text-primary" />
              <p className="text-sm text-muted-foreground">
                브라우저 프롬프트를 따라 생체 인증 또는 보안 키를 등록하세요
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="passkey-name">패스키 이름 (선택사항)</Label>
              <Input id="passkey-name" placeholder="예: MacBook Touch ID" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowFidoDialog(false)}>
              취소
            </Button>
            <Button
              onClick={() => {
                setShowFidoDialog(false)
                toast({
                  title: "FIDO 등록 완료",
                  description: "패스키가 성공적으로 등록되었습니다.",
                })
              }}
            >
              등록
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
