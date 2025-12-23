"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calendar, KeyRound, Fingerprint, Mail, Lock, ArrowLeft, Send } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [totpCode, setTotpCode] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [loginMethod, setLoginMethod] = useState<"password" | "totp" | "fido" | "magic-link">("password")
  const [magicLinkSent, setMagicLinkSent] = useState(false)

  // 비밀번호 로그인
  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // TODO: 실제 API 연동
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email, password }),
      // })

      // 임시: 이메일로 테넌트 구분
      console.log("[v0] Password login attempt:", { email, tenant: email.split("@")[1] })

      // 임시 로그인 성공 처리
      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/admin")
    } catch (err) {
      setError("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.")
    } finally {
      setLoading(false)
    }
  }

  // TOTP 로그인
  const handleTotpLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // TODO: 실제 API 연동
      console.log("[v0] TOTP login attempt:", { email, totpCode })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/admin")
    } catch (err) {
      setError("TOTP 인증에 실패했습니다. 코드를 확인해주세요.")
    } finally {
      setLoading(false)
    }
  }

  // FIDO (WebAuthn) 로그인
  const handleFidoLogin = async () => {
    if (!email) {
      setError("이메일을 입력해주세요.")
      return
    }

    setError("")
    setLoading(true)

    try {
      // TODO: WebAuthn API 연동
      // const credential = await navigator.credentials.get({
      //   publicKey: {
      //     challenge: new Uint8Array(32),
      //     allowCredentials: [],
      //     timeout: 60000,
      //   }
      // })

      console.log("[v0] FIDO login attempt:", { email })

      await new Promise((resolve) => setTimeout(resolve, 1000))
      router.push("/admin")
    } catch (err) {
      setError("FIDO 인증에 실패했습니다.")
    } finally {
      setLoading(false)
    }
  }

  // 매직링크 로그인
  const handleMagicLinkLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // TODO: 실제 API 연동
      // const response = await fetch('/api/auth/magic-link', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // })

      console.log("[v0] Magic link sent to:", email)

      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMagicLinkSent(true)
    } catch (err) {
      setError("매직링크 전송에 실패했습니다. 다시 시도해주세요.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-md">
        {/* 상단 로고 및 뒤로가기 */}
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
          <p className="text-muted-foreground">캠퍼스 예약 시스템에 로그인하세요</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>로그인</CardTitle>
            <CardDescription>등록된 이메일 주소로 로그인하세요</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={loginMethod} onValueChange={(v) => setLoginMethod(v as any)} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="password" className="flex items-center gap-1">
                  <Lock className="h-4 w-4" />
                  <span className="hidden sm:inline">비밀번호</span>
                </TabsTrigger>
                <TabsTrigger value="magic-link" className="flex items-center gap-1">
                  <Send className="h-4 w-4" />
                  <span className="hidden sm:inline">링크</span>
                </TabsTrigger>
                <TabsTrigger value="totp" className="flex items-center gap-1">
                  <KeyRound className="h-4 w-4" />
                  <span className="hidden sm:inline">TOTP</span>
                </TabsTrigger>
                <TabsTrigger value="fido" className="flex items-center gap-1">
                  <Fingerprint className="h-4 w-4" />
                  <span className="hidden sm:inline">FIDO</span>
                </TabsTrigger>
              </TabsList>

              {/* 비밀번호 로그인 */}
              <TabsContent value="password" className="space-y-4 mt-4">
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-password">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-password"
                        type="email"
                        placeholder="your-email@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">이메일 주소로 테넌트가 구분됩니다</p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">비밀번호</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "로그인 중..." : "로그인"}
                  </Button>
                </form>
              </TabsContent>

              {/* 매직링크 로그인 */}
              <TabsContent value="magic-link" className="space-y-4 mt-4">
                {!magicLinkSent ? (
                  <form onSubmit={handleMagicLinkLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email-magic">이메일</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="email-magic"
                          type="email"
                          placeholder="your-email@university.edu"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-10"
                          required
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">등록된 이메일로 로그인 링크를 전송해드립니다</p>
                    </div>
                    <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4 text-center">
                      <Send className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">
                        이메일로 받은 링크를 클릭하여 간편하게 로그인하세요
                      </p>
                    </div>
                    {error && (
                      <Alert variant="destructive">
                        <AlertDescription>{error}</AlertDescription>
                      </Alert>
                    )}
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "전송 중..." : "매직링크 전송"}
                    </Button>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <Alert>
                      <Mail className="h-4 w-4" />
                      <AlertDescription>
                        <strong>{email}</strong>로 로그인 링크를 전송했습니다.
                        <br />
                        이메일을 확인하고 링크를 클릭하여 로그인하세요.
                      </AlertDescription>
                    </Alert>
                    <Button variant="outline" onClick={() => setMagicLinkSent(false)} className="w-full">
                      다시 전송
                    </Button>
                  </div>
                )}
              </TabsContent>

              {/* TOTP 로그인 */}
              <TabsContent value="totp" className="space-y-4 mt-4">
                <form onSubmit={handleTotpLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-totp">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-totp"
                        type="email"
                        placeholder="your-email@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="totp-code">TOTP 인증 코드</Label>
                    <div className="relative">
                      <KeyRound className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="totp-code"
                        type="text"
                        placeholder="6자리 코드"
                        value={totpCode}
                        onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="pl-10"
                        maxLength={6}
                        required
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">인증 앱에서 생성된 6자리 코드를 입력하세요</p>
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "인증 중..." : "TOTP 인증"}
                  </Button>
                </form>
              </TabsContent>

              {/* FIDO 로그인 */}
              <TabsContent value="fido" className="space-y-4 mt-4">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email-fido">이메일</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email-fido"
                        type="email"
                        placeholder="your-email@university.edu"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  <div className="rounded-lg border border-dashed border-muted-foreground/30 p-6 text-center">
                    <Fingerprint className="h-12 w-12 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-4">
                      보안 키, 지문 인식, 또는 얼굴 인식을 사용하여 로그인하세요
                    </p>
                    <p className="text-xs text-muted-foreground">FIDO는 로그인 후 개인 설정에서 등록할 수 있습니다</p>
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button onClick={handleFidoLogin} className="w-full" disabled={loading || !email}>
                    {loading ? "인증 중..." : "FIDO 인증"}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <div className="text-sm text-center text-muted-foreground">
              <Link href="/forgot-password" className="hover:underline">
                비밀번호를 잊으셨나요?
              </Link>
            </div>
            <div className="text-sm text-center text-muted-foreground">
              조직이 처음이신가요?{" "}
              <Link href="/onboarding" className="font-medium text-primary hover:underline">
                테넌트 생성하기
              </Link>
            </div>
          </CardFooter>
        </Card>

        {/* 하단 안내 */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          <p>매직링크, TOTP 및 FIDO 인증은 로그인 후</p>
          <p>개인 설정에서 등록하여 사용할 수 있습니다</p>
        </div>
      </div>
    </div>
  )
}
