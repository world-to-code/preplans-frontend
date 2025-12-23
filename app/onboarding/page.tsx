"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, ArrowLeft, ArrowRight, Building2, Mail, User, Lock, CheckCircle2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  // 폼 데이터
  const [orgName, setOrgName] = useState("")
  const [orgDomain, setOrgDomain] = useState("")
  const [orgDescription, setOrgDescription] = useState("")
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [adminPasswordConfirm, setAdminPasswordConfirm] = useState("")

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    if (adminPassword !== adminPasswordConfirm) {
      alert("비밀번호가 일치하지 않습니다")
      return
    }

    setLoading(true)
    try {
      // TODO: API 연동
      // const response = await fetch('/api/tenants/create', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     organization: { name: orgName, domain: orgDomain, description: orgDescription },
      //     admin: { name: adminName, email: adminEmail, password: adminPassword },
      //   }),
      // })

      console.log("[v0] Creating tenant:", {
        org: { orgName, orgDomain, orgDescription },
        admin: { adminName, adminEmail },
      })

      await new Promise((resolve) => setTimeout(resolve, 1500))
      setStep(4)
    } catch (error) {
      alert("테넌트 생성에 실패했습니다")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-2xl">
        {/* 상단 헤더 */}
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            메인으로 돌아가기
          </Link>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Campus Booking</h1>
          </div>
          <p className="text-muted-foreground">새로운 테넌트를 생성하고 시작하세요</p>
        </div>

        {/* 진행 상태 표시 */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`flex items-center justify-center h-8 w-8 rounded-full border-2 transition-colors ${
                      step >= s ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30"
                    }`}
                  >
                    {s}
                  </div>
                  {s < 3 && (
                    <div
                      className={`h-0.5 w-16 mx-2 transition-colors ${
                        step > s ? "bg-primary" : "bg-muted-foreground/30"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>조직 정보</span>
              <span>관리자 정보</span>
              <span>확인</span>
            </div>
          </div>
        )}

        <Card>
          {/* Step 1: 조직 정보 */}
          {step === 1 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  조직 정보
                </CardTitle>
                <CardDescription>사용하실 조직(학교, 기관)의 정보를 입력해주세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">조직 이름 *</Label>
                  <Input
                    id="org-name"
                    placeholder="예: 서울대학교"
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-domain">도메인 *</Label>
                  <Input
                    id="org-domain"
                    placeholder="예: snu.ac.kr"
                    value={orgDomain}
                    onChange={(e) => setOrgDomain(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">학교 이메일 도메인을 입력해주세요</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="org-description">설명 (선택)</Label>
                  <Textarea
                    id="org-description"
                    placeholder="조직에 대한 간단한 설명을 입력하세요"
                    value={orgDescription}
                    onChange={(e) => setOrgDescription(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleNext} disabled={!orgName || !orgDomain}>
                    다음
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 2: 관리자 정보 */}
          {step === 2 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  관리자 정보
                </CardTitle>
                <CardDescription>테넌트를 관리할 관리자 계정을 생성합니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-name">이름 *</Label>
                  <Input
                    id="admin-name"
                    placeholder="홍길동"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-email">이메일 *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder={`admin@${orgDomain || "university.edu"}`}
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">이 이메일로 테넌트가 구분됩니다</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">비밀번호 *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-password"
                      type="password"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password-confirm">비밀번호 확인 *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="admin-password-confirm"
                      type="password"
                      placeholder="••••••••"
                      value={adminPasswordConfirm}
                      onChange={(e) => setAdminPasswordConfirm(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    이전
                  </Button>
                  <Button
                    onClick={handleNext}
                    disabled={!adminName || !adminEmail || !adminPassword || !adminPasswordConfirm}
                  >
                    다음
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 3: 확인 */}
          {step === 3 && (
            <>
              <CardHeader>
                <CardTitle>입력 내용 확인</CardTitle>
                <CardDescription>아래 내용을 확인하고 테넌트를 생성하세요</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    조직 정보
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">이름:</span> {orgName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">도메인:</span> {orgDomain}
                    </p>
                    {orgDescription && (
                      <p>
                        <span className="text-muted-foreground">설명:</span> {orgDescription}
                      </p>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border p-4 space-y-3">
                  <h3 className="font-semibold flex items-center gap-2">
                    <User className="h-4 w-4" />
                    관리자 정보
                  </h3>
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="text-muted-foreground">이름:</span> {adminName}
                    </p>
                    <p>
                      <span className="text-muted-foreground">이메일:</span> {adminEmail}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    이전
                  </Button>
                  <Button onClick={handleSubmit} disabled={loading}>
                    {loading ? "생성 중..." : "테넌트 생성"}
                  </Button>
                </div>
              </CardContent>
            </>
          )}

          {/* Step 4: 완료 */}
          {step === 4 && (
            <>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-6 w-6" />
                  테넌트 생성 완료!
                </CardTitle>
                <CardDescription>축하합니다! 테넌트가 성공적으로 생성되었습니다</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                  <p className="text-sm text-green-800">
                    <strong>{orgName}</strong> 테넌트가 생성되었습니다.
                    <br />
                    이제 관리자 계정으로 로그인하여 시스템을 설정하고 사용자를 초대할 수 있습니다.
                  </p>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">다음 단계:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
                    <li>관리자 대시보드에서 이벤트 생성</li>
                    <li>사용자 그룹 설정 및 사용자 초대</li>
                    <li>예약 설정 및 알림 구성</li>
                  </ul>
                </div>
                <Button onClick={() => router.push("/login")} className="w-full" size="lg">
                  로그인하러 가기
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </CardContent>
            </>
          )}
        </Card>

        {step < 4 && (
          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>이미 테넌트가 있으신가요?</p>
            <Link href="/login" className="text-primary hover:underline">
              로그인하기
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
