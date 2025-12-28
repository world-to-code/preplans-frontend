"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserCog, Users, GraduationCap, Shield } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SecurityPolicyForm } from "@/components/admin/security/security-policy-form"
import { AuthChainBuilder } from "@/components/admin/security/auth-chain-builder"
import {
  ResourceManagement,
  type TrustedLocation,
  type TrustedDevice,
  type TrustedTimeRange,
  type TrustedIpRange,
} from "@/components/admin/security/resource-management"

interface SecurityPolicy {
  securityLevel: string
  sessionTimeout: string
  sessionIdleTimeout: string
  maxLoginAttempts: string
  lockoutDuration: string
  passwordMinLength: string
  passwordRequireUppercase: boolean
  passwordRequireNumbers: boolean
  passwordRequireSpecialChars: boolean
  passwordExpiryDays: string
  mfaRequired: boolean
  mfaEnabledMethods: {
    totp: boolean
    fido: boolean
    email: boolean
    sms: boolean
  }
}

interface AuthStep {
  id: string
  method: string
  mode: "required" | "conditional"
  conditions?: Array<{
    type: string
    operator: string
    value: string
  }>
}

export default function SecurityAccessPage() {
  const { toast } = useToast()

  const [adminPolicy, setAdminPolicy] = useState<SecurityPolicy>({
    securityLevel: "high",
    sessionTimeout: "120",
    sessionIdleTimeout: "60",
    maxLoginAttempts: "3",
    lockoutDuration: "60",
    passwordMinLength: "12",
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    passwordExpiryDays: "60",
    mfaRequired: true,
    mfaEnabledMethods: {
      totp: true,
      fido: true,
      email: true,
      sms: false,
    },
  })

  const [studentPolicy, setStudentPolicy] = useState<SecurityPolicy>({
    securityLevel: "medium",
    sessionTimeout: "240",
    sessionIdleTimeout: "120",
    maxLoginAttempts: "5",
    lockoutDuration: "30",
    passwordMinLength: "10",
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: false,
    passwordExpiryDays: "90",
    mfaRequired: false,
    mfaEnabledMethods: {
      totp: true,
      fido: true,
      email: true,
      sms: true,
    },
  })

  const [professorPolicy, setProfessorPolicy] = useState<SecurityPolicy>({
    securityLevel: "high",
    sessionTimeout: "180",
    sessionIdleTimeout: "90",
    maxLoginAttempts: "4",
    lockoutDuration: "45",
    passwordMinLength: "12",
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecialChars: true,
    passwordExpiryDays: "75",
    mfaRequired: true,
    mfaEnabledMethods: {
      totp: true,
      fido: true,
      email: true,
      sms: false,
    },
  })

  const [adminAuthChain, setAdminAuthChain] = useState<AuthStep[]>([])
  const [studentAuthChain, setStudentAuthChain] = useState<AuthStep[]>([])
  const [professorAuthChain, setProfessorAuthChain] = useState<AuthStep[]>([])

  const [trustedLocations, setTrustedLocations] = useState<TrustedLocation[]>([
    {
      id: "1",
      name: "서울 본사",
      description: "메인 오피스",
      country: "KR",
      city: "서울",
      ipRanges: ["192.168.1.0/24"],
    },
  ])

  const [trustedDevices, setTrustedDevices] = useState<TrustedDevice[]>([
    {
      id: "1",
      name: "회사 노트북",
      description: "인증된 업무용 노트북",
      deviceType: "Laptop",
      osVersion: "Windows 11",
    },
  ])

  const [trustedTimeRanges, setTrustedTimeRanges] = useState<TrustedTimeRange[]>([
    {
      id: "1",
      name: "업무 시간",
      description: "평일 근무 시간",
      startTime: "09:00",
      endTime: "18:00",
      daysOfWeek: ["월", "화", "수", "목", "금"],
    },
  ])

  const [trustedIpRanges, setTrustedIpRanges] = useState<TrustedIpRange[]>([
    {
      id: "1",
      name: "본사 네트워크",
      description: "메인 오피스 IP 범위",
      ipRange: "192.168.1.0/24",
      type: "whitelist",
    },
  ])

  const handleSave = (role: string) => {
    toast({
      title: "설정 저장됨",
      description: `${role} 보안 설정이 저장되었습니다.`,
    })
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">보안 및 접근 관리</h1>
        <p className="text-muted-foreground mt-2">역할별 보안 정책, 인증 체인, 리소스를 관리합니다.</p>
      </div>

      <Tabs defaultValue="admin" className="space-y-6">
        <TabsList className="grid w-full max-w-2xl grid-cols-4">
          <TabsTrigger value="admin" className="gap-2">
            <UserCog className="h-4 w-4" />
            관리자
          </TabsTrigger>
          <TabsTrigger value="student" className="gap-2">
            <Users className="h-4 w-4" />
            학생
          </TabsTrigger>
          <TabsTrigger value="professor" className="gap-2">
            <GraduationCap className="h-4 w-4" />
            교수
          </TabsTrigger>
          <TabsTrigger value="resources" className="gap-2">
            <Shield className="h-4 w-4" />
            리소스 관리
          </TabsTrigger>
        </TabsList>

        <TabsContent value="admin" className="space-y-6">
          <AuthChainBuilder
            role="admin"
            authChain={adminAuthChain}
            onAuthChainChange={setAdminAuthChain}
            trustedLocations={trustedLocations}
            trustedDevices={trustedDevices}
            trustedTimeRanges={trustedTimeRanges}
            trustedIpRanges={trustedIpRanges}
          />
          <SecurityPolicyForm
            role="admin"
            policy={adminPolicy}
            onPolicyChange={setAdminPolicy}
            onSave={() => handleSave("관리자")}
          />
        </TabsContent>

        <TabsContent value="student" className="space-y-6">
          <AuthChainBuilder
            role="student"
            authChain={studentAuthChain}
            onAuthChainChange={setStudentAuthChain}
            trustedLocations={trustedLocations}
            trustedDevices={trustedDevices}
            trustedTimeRanges={trustedTimeRanges}
            trustedIpRanges={trustedIpRanges}
          />
          <SecurityPolicyForm
            role="student"
            policy={studentPolicy}
            onPolicyChange={setStudentPolicy}
            onSave={() => handleSave("학생")}
          />
        </TabsContent>

        <TabsContent value="professor" className="space-y-6">
          <AuthChainBuilder
            role="professor"
            authChain={professorAuthChain}
            onAuthChainChange={setProfessorAuthChain}
            trustedLocations={trustedLocations}
            trustedDevices={trustedDevices}
            trustedTimeRanges={trustedTimeRanges}
            trustedIpRanges={trustedIpRanges}
          />
          <SecurityPolicyForm
            role="professor"
            policy={professorPolicy}
            onPolicyChange={setProfessorPolicy}
            onSave={() => handleSave("교수")}
          />
        </TabsContent>

        <TabsContent value="resources">
          <ResourceManagement
            trustedLocations={trustedLocations}
            trustedDevices={trustedDevices}
            trustedTimeRanges={trustedTimeRanges}
            trustedIpRanges={trustedIpRanges}
            onLocationsChange={setTrustedLocations}
            onDevicesChange={setTrustedDevices}
            onTimeRangesChange={setTrustedTimeRanges}
            onIpRangesChange={setTrustedIpRanges}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
