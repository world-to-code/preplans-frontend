"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"

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

interface SecurityPolicyFormProps {
  role: "admin" | "student" | "professor"
  policy: SecurityPolicy
  onPolicyChange: (policy: SecurityPolicy) => void
  onSave: () => void
}

const SECURITY_PRESETS = {
  low: {
    sessionTimeout: "480",
    sessionIdleTimeout: "240",
    maxLoginAttempts: "10",
    lockoutDuration: "15",
    passwordMinLength: "8",
    passwordExpiryDays: "180",
  },
  medium: {
    sessionTimeout: "240",
    sessionIdleTimeout: "120",
    maxLoginAttempts: "5",
    lockoutDuration: "30",
    passwordMinLength: "10",
    passwordExpiryDays: "90",
  },
  high: {
    sessionTimeout: "120",
    sessionIdleTimeout: "60",
    maxLoginAttempts: "3",
    lockoutDuration: "60",
    passwordMinLength: "12",
    passwordExpiryDays: "60",
  },
  critical: {
    sessionTimeout: "60",
    sessionIdleTimeout: "30",
    maxLoginAttempts: "3",
    lockoutDuration: "120",
    passwordMinLength: "14",
    passwordExpiryDays: "30",
  },
}

export function SecurityPolicyForm({ role, policy, onPolicyChange, onSave }: SecurityPolicyFormProps) {
  const handleSecurityLevelChange = (level: string) => {
    const preset = SECURITY_PRESETS[level as keyof typeof SECURITY_PRESETS]
    if (preset) {
      onPolicyChange({
        ...policy,
        securityLevel: level,
        ...preset,
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
        <div>
          <h3 className="font-semibold">
            {role === "admin" ? "관리자" : role === "student" ? "학생" : "교수"} 보안 정책
          </h3>
          <p className="text-sm text-muted-foreground mt-1">아래 설정을 변경한 후 저장 버튼을 클릭하세요.</p>
        </div>
        <Button onClick={onSave} size="lg">
          변경사항 저장
        </Button>
      </div>

      {/* Session Management */}
      <Card>
        <CardHeader>
          <CardTitle>세션 관리</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>최대 세션 시간 (분)</Label>
            <Input
              type="number"
              value={policy.sessionTimeout}
              onChange={(e) => onPolicyChange({ ...policy, sessionTimeout: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">로그인 후 최대 유지 가능한 세션 시간</p>
          </div>
          <div className="space-y-2">
            <Label>유휴 세션 타임아웃 (분)</Label>
            <Input
              type="number"
              value={policy.sessionIdleTimeout}
              onChange={(e) => onPolicyChange({ ...policy, sessionIdleTimeout: e.target.value })}
            />
            <p className="text-sm text-muted-foreground">활동이 없을 때 세션이 만료되는 시간</p>
          </div>
        </CardContent>
      </Card>

      {/* Login Security */}
      <Card>
        <CardHeader>
          <CardTitle>로그인 보안</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>최대 로그인 시도 횟수</Label>
            <Input
              type="number"
              value={policy.maxLoginAttempts}
              onChange={(e) => onPolicyChange({ ...policy, maxLoginAttempts: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>계정 잠금 시간 (분)</Label>
            <Input
              type="number"
              value={policy.lockoutDuration}
              onChange={(e) => onPolicyChange({ ...policy, lockoutDuration: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* Password Policy */}
      <Card>
        <CardHeader>
          <CardTitle>비밀번호 정책</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>최소 길이</Label>
            <Input
              type="number"
              value={policy.passwordMinLength}
              onChange={(e) => onPolicyChange({ ...policy, passwordMinLength: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>대문자 필수</Label>
            <Switch
              checked={policy.passwordRequireUppercase}
              onCheckedChange={(checked) => onPolicyChange({ ...policy, passwordRequireUppercase: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>숫자 필수</Label>
            <Switch
              checked={policy.passwordRequireNumbers}
              onCheckedChange={(checked) => onPolicyChange({ ...policy, passwordRequireNumbers: checked })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label>특수문자 필수</Label>
            <Switch
              checked={policy.passwordRequireSpecialChars}
              onCheckedChange={(checked) => onPolicyChange({ ...policy, passwordRequireSpecialChars: checked })}
            />
          </div>
          <div className="space-y-2">
            <Label>비밀번호 만료 기간 (일)</Label>
            <Input
              type="number"
              value={policy.passwordExpiryDays}
              onChange={(e) => onPolicyChange({ ...policy, passwordExpiryDays: e.target.value })}
            />
          </div>
        </CardContent>
      </Card>

      {/* MFA Settings */}
      <Card>
        <CardHeader>
          <CardTitle>다단계 인증 (MFA)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>MFA 필수</Label>
              <p className="text-sm text-muted-foreground">
                모든 {role === "admin" ? "관리자" : role === "student" ? "학생" : "교수"}에게 MFA 적용
              </p>
            </div>
            <Switch
              checked={policy.mfaRequired}
              onCheckedChange={(checked) => onPolicyChange({ ...policy, mfaRequired: checked })}
            />
          </div>
          {policy.mfaRequired && (
            <div className="space-y-3 pt-4 border-t">
              <Label>사용 가능한 MFA 방식</Label>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="totp"
                    checked={policy.mfaEnabledMethods.totp}
                    onCheckedChange={(checked) =>
                      onPolicyChange({
                        ...policy,
                        mfaEnabledMethods: { ...policy.mfaEnabledMethods, totp: !!checked },
                      })
                    }
                  />
                  <Label htmlFor="totp" className="font-normal">
                    TOTP (Google Authenticator, Authy 등)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="fido"
                    checked={policy.mfaEnabledMethods.fido}
                    onCheckedChange={(checked) =>
                      onPolicyChange({
                        ...policy,
                        mfaEnabledMethods: { ...policy.mfaEnabledMethods, fido: !!checked },
                      })
                    }
                  />
                  <Label htmlFor="fido" className="font-normal">
                    FIDO/WebAuthn (지문, 얼굴 인식, 보안 키)
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email"
                    checked={policy.mfaEnabledMethods.email}
                    onCheckedChange={(checked) =>
                      onPolicyChange({
                        ...policy,
                        mfaEnabledMethods: { ...policy.mfaEnabledMethods, email: !!checked },
                      })
                    }
                  />
                  <Label htmlFor="email" className="font-normal">
                    이메일 인증
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="sms"
                    checked={policy.mfaEnabledMethods.sms}
                    onCheckedChange={(checked) =>
                      onPolicyChange({
                        ...policy,
                        mfaEnabledMethods: { ...policy.mfaEnabledMethods, sms: !!checked },
                      })
                    }
                  />
                  <Label htmlFor="sms" className="font-normal">
                    SMS 인증
                  </Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                사용자가 선택한 방식으로 MFA를 등록할 수 있습니다. 최소 1개 이상 활성화해야 합니다.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* <Button onClick={onSave} className="w-full">
        설정 저장
      </Button> */}
    </div>
  )
}
