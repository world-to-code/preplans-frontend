import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Clock,
  User,
  ArrowRight,
  BookOpen,
  Users,
  DoorOpen,
  GraduationCap,
  CheckCircle2,
  Star,
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <header
        className="sticky top-0 z-50 border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80"
        role="banner"
      >
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                <Calendar className="h-6 w-6 text-primary-foreground" aria-hidden="true" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Campus Booking</h1>
                <p className="text-xs text-muted-foreground">Smart Campus Management</p>
              </div>
            </div>
            <nav className="flex items-center gap-2" aria-label="Main navigation">
              <Button variant="ghost" asChild>
                <Link href="/login">로그인</Link>
              </Button>
              <Button asChild>
                <Link href="/onboarding">시작하기</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-16 md:py-24" id="main-content">
        <div className="mx-auto max-w-5xl">
          <div className="text-center">
            <Badge variant="secondary" className="mb-4 px-4 py-1">
              <GraduationCap className="mr-2 h-4 w-4" aria-hidden="true" />
              학생을 위한 스마트 캠퍼스 예약 시스템
            </Badge>
            <h2 className="text-balance text-4xl font-bold tracking-tight text-foreground md:text-6xl">
              캠퍼스 생활을 더 편리하게
            </h2>
            <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground md:text-xl">
              교수 상담, 스터디룸 예약, 학교 행사 신청까지 한 곳에서. 모바일에 최적화된 간편한 예약 시스템으로 캠퍼스
              생활을 스마트하게 관리하세요.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto" asChild>
                <Link href="/onboarding">
                  지금 예약하기
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="w-full bg-transparent sm:w-auto" asChild>
                <Link href="/professor">관리자 페이지</Link>
              </Button>
            </div>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            <Card className="border-2">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-2 text-3xl font-bold text-primary">1,500+</div>
                <p className="text-sm text-muted-foreground">월간 예약 건수</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-2 text-3xl font-bold text-primary">98%</div>
                <p className="text-sm text-muted-foreground">학생 만족도</p>
              </CardContent>
            </Card>
            <Card className="border-2">
              <CardContent className="flex flex-col items-center p-6 text-center">
                <div className="mb-2 text-3xl font-bold text-primary">24/7</div>
                <p className="text-sm text-muted-foreground">언제 어디서나 예약</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16" aria-labelledby="categories-heading">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 id="categories-heading" className="text-3xl font-bold text-foreground">
              다양한 예약 서비스
            </h2>
            <p className="mt-3 text-muted-foreground">학생들이 필요한 모든 캠퍼스 리소스를 한 곳에서 예약하세요</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <Card className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-6 w-6 text-primary" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">교수 상담</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  학업 상담, 진로 지도, 연구 기회 등 교수님과의 1:1 상담을 간편하게 예약하세요.
                </p>
                <Button variant="link" className="p-0" asChild>
                  <Link href="/onboarding">
                    예약하기 <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10">
                  <DoorOpen className="h-6 w-6 text-accent-foreground" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">스터디룸 예약</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  팀 프로젝트나 그룹 스터디를 위한 스터디룸을 실시간으로 확인하고 예약하세요.
                </p>
                <Button variant="link" className="p-0" asChild>
                  <Link href="/onboarding">
                    예약하기 <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="transition-all hover:shadow-lg">
              <CardContent className="p-6">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
                  <Users className="h-6 w-6 text-success-foreground" aria-hidden="true" />
                </div>
                <h3 className="mb-2 text-xl font-semibold text-foreground">학교 행사</h3>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  오리엔테이션, 특강, 워크샵 등 다양한 학교 행사에 온라인으로 신청하세요.
                </p>
                <Button variant="link" className="p-0" asChild>
                  <Link href="/onboarding">
                    신청하기 <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16" aria-labelledby="features-heading">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 id="features-heading" className="text-3xl font-bold text-foreground">
              왜 Campus Booking인가요?
            </h2>
            <p className="mt-3 text-muted-foreground">학생 중심으로 설계된 편리한 기능들</p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <article className="flex flex-col items-center text-center">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg"
                aria-hidden="true"
              >
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">간편한 예약</h3>
              <p className="leading-relaxed text-muted-foreground text-sm">
                몇 번의 탭만으로 원하는 시간대를 예약할 수 있습니다.
              </p>
            </article>
            <article className="flex flex-col items-center text-center">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-lg"
                aria-hidden="true"
              >
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">실시간 알림</h3>
              <p className="leading-relaxed text-muted-foreground text-sm">
                예약 확인과 리마인더를 실시간으로 받아보세요.
              </p>
            </article>
            <article className="flex flex-col items-center text-center">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-success text-success-foreground shadow-lg"
                aria-hidden="true"
              >
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">통합 관리</h3>
              <p className="leading-relaxed text-muted-foreground text-sm">
                모든 예약 내역을 한 곳에서 확인하고 관리하세요.
              </p>
            </article>
            <article className="flex flex-col items-center text-center">
              <div
                className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-primary/20 text-primary shadow-lg"
                aria-hidden="true"
              >
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">모바일 최적화</h3>
              <p className="leading-relaxed text-muted-foreground text-sm">
                언제 어디서나 스마트폰으로 빠르게 예약하세요.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-muted/30 py-16" aria-labelledby="testimonials-heading">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 id="testimonials-heading" className="text-3xl font-bold text-foreground">
              학생들의 후기
            </h2>
            <p className="mt-3 text-muted-foreground">실제 사용자들의 생생한 경험담</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                  ))}
                </div>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  "교수님과의 상담 예약이 정말 편해졌어요. 이제는 이메일 주고받을 필요 없이 바로 예약할 수 있어서 시간이
                  많이 절약됩니다."
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                    김
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">김민준</p>
                    <p className="text-sm text-muted-foreground">컴퓨터공학과 3학년</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                  ))}
                </div>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  "스터디룸 예약할 때마다 직접 가서 확인해야 했는데, 이제는 앱으로 실시간으로 빈 자리를 확인하고 예약할
                  수 있어요!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-accent-foreground font-semibold">
                    이
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">이서연</p>
                    <p className="text-sm text-muted-foreground">경영학과 2학년</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-primary text-primary" aria-hidden="true" />
                  ))}
                </div>
                <p className="mb-4 leading-relaxed text-muted-foreground">
                  "행사 신청도 간편하고, 알림도 제때 와서 놓칠 일이 없어요. 학교 생활에 꼭 필요한 서비스입니다!"
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success text-success-foreground font-semibold">
                    박
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">박준혁</p>
                    <p className="text-sm text-muted-foreground">디자인학과 4학년</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="border-2 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">지금 바로 시작하세요</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                캠퍼스 생활을 더 스마트하게. 무료로 시작하고 모든 예약 서비스를 이용해보세요.
              </p>
              <Button size="lg" asChild>
                <Link href="/onboarding">
                  무료로 시작하기
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-border bg-muted/30 py-12" role="contentinfo">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-4">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Calendar className="h-5 w-5 text-primary-foreground" aria-hidden="true" />
                </div>
                <span className="font-bold text-foreground">Campus Booking</span>
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">학생들을 위한 스마트 캠퍼스 예약 시스템</p>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">서비스</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/onboarding" className="text-muted-foreground hover:text-foreground transition-colors">
                    교수 상담 예약
                  </Link>
                </li>
                <li>
                  <Link href="/onboarding" className="text-muted-foreground hover:text-foreground transition-colors">
                    스터디룸 예약
                  </Link>
                </li>
                <li>
                  <Link href="/onboarding" className="text-muted-foreground hover:text-foreground transition-colors">
                    행사 신청
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">지원</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    소개
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                    문의하기
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground transition-colors">
                    자주 묻는 질문
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="mb-4 font-semibold text-foreground">법적 고지</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    개인정보처리방침
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    이용약관
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t border-border pt-8 text-center">
            <p className="text-sm text-muted-foreground">© 2025 Campus Booking. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
