"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, MapPin, Laptop, Clock, Network } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export interface TrustedLocation {
  id: string
  name: string
  description: string
  country: string
  city: string
  ipRanges: string[]
}

export interface TrustedDevice {
  id: string
  name: string
  description: string
  deviceType: string
  osVersion: string
}

export interface TrustedTimeRange {
  id: string
  name: string
  description: string
  startTime: string
  endTime: string
  daysOfWeek: string[]
}

export interface TrustedIpRange {
  id: string
  name: string
  description: string
  ipRange: string
  type: string
}

interface ResourceManagementProps {
  trustedLocations: TrustedLocation[]
  trustedDevices: TrustedDevice[]
  trustedTimeRanges: TrustedTimeRange[]
  trustedIpRanges: TrustedIpRange[]
  onLocationsChange: (locations: TrustedLocation[]) => void
  onDevicesChange: (devices: TrustedDevice[]) => void
  onTimeRangesChange: (ranges: TrustedTimeRange[]) => void
  onIpRangesChange: (ranges: TrustedIpRange[]) => void
}

export function ResourceManagement({
  trustedLocations,
  trustedDevices,
  trustedTimeRanges,
  trustedIpRanges,
  onLocationsChange,
  onDevicesChange,
  onTimeRangesChange,
  onIpRangesChange,
}: ResourceManagementProps) {
  const { toast } = useToast()

  const [newLocation, setNewLocation] = useState({ name: "", description: "", country: "", city: "", ipRange: "" })
  const [newDevice, setNewDevice] = useState({ name: "", description: "", deviceType: "", osVersion: "" })
  const [newTimeRange, setNewTimeRange] = useState({ name: "", description: "", startTime: "", endTime: "", day: "" })
  const [newIpRange, setNewIpRange] = useState({ name: "", description: "", ipRange: "", type: "whitelist" })

  const addLocation = () => {
    if (!newLocation.name || !newLocation.country || !newLocation.city) {
      toast({ title: "입력 오류", description: "필수 항목을 입력해주세요.", variant: "destructive" })
      return
    }
    const location: TrustedLocation = {
      id: Date.now().toString(),
      name: newLocation.name,
      description: newLocation.description,
      country: newLocation.country,
      city: newLocation.city,
      ipRanges: newLocation.ipRange ? [newLocation.ipRange] : [],
    }
    onLocationsChange([...trustedLocations, location])
    setNewLocation({ name: "", description: "", country: "", city: "", ipRange: "" })
    toast({ title: "위치 추가됨", description: `${newLocation.name}이(가) 추가되었습니다.` })
  }

  const removeLocation = (id: string) => {
    onLocationsChange(trustedLocations.filter((loc) => loc.id !== id))
    toast({ title: "위치 삭제됨" })
  }

  const addDevice = () => {
    if (!newDevice.name || !newDevice.deviceType) {
      toast({ title: "입력 오류", description: "필수 항목을 입력해주세요.", variant: "destructive" })
      return
    }
    const device: TrustedDevice = {
      id: Date.now().toString(),
      ...newDevice,
    }
    onDevicesChange([...trustedDevices, device])
    setNewDevice({ name: "", description: "", deviceType: "", osVersion: "" })
    toast({ title: "디바이스 추가됨" })
  }

  const removeDevice = (id: string) => {
    onDevicesChange(trustedDevices.filter((dev) => dev.id !== id))
    toast({ title: "디바이스 삭제됨" })
  }

  const addTimeRange = () => {
    if (!newTimeRange.name || !newTimeRange.startTime || !newTimeRange.endTime) {
      toast({ title: "입력 오류", description: "필수 항목을 입력해주세요.", variant: "destructive" })
      return
    }
    const timeRange: TrustedTimeRange = {
      id: Date.now().toString(),
      name: newTimeRange.name,
      description: newTimeRange.description,
      startTime: newTimeRange.startTime,
      endTime: newTimeRange.endTime,
      daysOfWeek: newTimeRange.day ? [newTimeRange.day] : [],
    }
    onTimeRangesChange([...trustedTimeRanges, timeRange])
    setNewTimeRange({ name: "", description: "", startTime: "", endTime: "", day: "" })
    toast({ title: "시간대 추가됨" })
  }

  const removeTimeRange = (id: string) => {
    onTimeRangesChange(trustedTimeRanges.filter((time) => time.id !== id))
    toast({ title: "시간대 삭제됨" })
  }

  const addIpRange = () => {
    if (!newIpRange.name || !newIpRange.ipRange) {
      toast({ title: "입력 오류", description: "필수 항목을 입력해주세요.", variant: "destructive" })
      return
    }
    const ipRange: TrustedIpRange = {
      id: Date.now().toString(),
      ...newIpRange,
    }
    onIpRangesChange([...trustedIpRanges, ipRange])
    setNewIpRange({ name: "", description: "", ipRange: "", type: "whitelist" })
    toast({ title: "IP 범위 추가됨" })
  }

  const removeIpRange = (id: string) => {
    onIpRangesChange(trustedIpRanges.filter((ip) => ip.id !== id))
    toast({ title: "IP 범위 삭제됨" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>통합 리소스 관리</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="locations" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="locations" className="gap-2">
              <MapPin className="h-4 w-4" />
              위치
            </TabsTrigger>
            <TabsTrigger value="devices" className="gap-2">
              <Laptop className="h-4 w-4" />
              디바이스
            </TabsTrigger>
            <TabsTrigger value="times" className="gap-2">
              <Clock className="h-4 w-4" />
              시간대
            </TabsTrigger>
            <TabsTrigger value="ips" className="gap-2">
              <Network className="h-4 w-4" />
              IP 범위
            </TabsTrigger>
          </TabsList>

          <TabsContent value="locations" className="space-y-4">
            <div className="space-y-4">
              {trustedLocations.map((location) => (
                <Card key={location.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{location.name}</h4>
                          <Badge variant="secondary">{location.country}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{location.description}</p>
                        <p className="text-xs text-muted-foreground">{location.city}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeLocation(location.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" />새 위치 추가
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>이름 *</Label>
                    <Input
                      placeholder="예: 서울 본사"
                      value={newLocation.name}
                      onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>국가 *</Label>
                    <Input
                      placeholder="예: KR"
                      value={newLocation.country}
                      onChange={(e) => setNewLocation({ ...newLocation, country: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>도시 *</Label>
                    <Input
                      placeholder="예: 서울"
                      value={newLocation.city}
                      onChange={(e) => setNewLocation({ ...newLocation, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>IP 범위 (선택)</Label>
                    <Input
                      placeholder="예: 192.168.1.0/24"
                      value={newLocation.ipRange}
                      onChange={(e) => setNewLocation({ ...newLocation, ipRange: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>설명</Label>
                  <Textarea
                    placeholder="위치에 대한 설명"
                    value={newLocation.description}
                    onChange={(e) => setNewLocation({ ...newLocation, description: e.target.value })}
                  />
                </div>
                <Button onClick={addLocation} className="w-full">
                  추가
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="devices" className="space-y-4">
            <div className="space-y-4">
              {trustedDevices.map((device) => (
                <Card key={device.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{device.name}</h4>
                          <Badge variant="secondary">{device.deviceType}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{device.description}</p>
                        {device.osVersion && <p className="text-xs text-muted-foreground">OS: {device.osVersion}</p>}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeDevice(device.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" />새 디바이스 추가
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>이름 *</Label>
                    <Input
                      placeholder="예: 회사 노트북"
                      value={newDevice.name}
                      onChange={(e) => setNewDevice({ ...newDevice, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>디바이스 유형 *</Label>
                    <Input
                      placeholder="예: Laptop"
                      value={newDevice.deviceType}
                      onChange={(e) => setNewDevice({ ...newDevice, deviceType: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>OS 버전</Label>
                    <Input
                      placeholder="예: Windows 11"
                      value={newDevice.osVersion}
                      onChange={(e) => setNewDevice({ ...newDevice, osVersion: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>설명</Label>
                  <Textarea
                    placeholder="디바이스에 대한 설명"
                    value={newDevice.description}
                    onChange={(e) => setNewDevice({ ...newDevice, description: e.target.value })}
                  />
                </div>
                <Button onClick={addDevice} className="w-full">
                  추가
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="times" className="space-y-4">
            <div className="space-y-4">
              {trustedTimeRanges.map((timeRange) => (
                <Card key={timeRange.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium">{timeRange.name}</h4>
                        <p className="text-sm text-muted-foreground">{timeRange.description}</p>
                        <p className="text-xs text-muted-foreground">
                          {timeRange.startTime} - {timeRange.endTime}
                        </p>
                        {timeRange.daysOfWeek.length > 0 && (
                          <div className="flex gap-1">
                            {timeRange.daysOfWeek.map((day) => (
                              <Badge key={day} variant="outline" className="text-xs">
                                {day}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeTimeRange(timeRange.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" />새 시간대 추가
                </h4>
                <div className="space-y-2">
                  <Label>이름 *</Label>
                  <Input
                    placeholder="예: 업무 시간"
                    value={newTimeRange.name}
                    onChange={(e) => setNewTimeRange({ ...newTimeRange, name: e.target.value })}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>시작 시간 *</Label>
                    <Input
                      type="time"
                      value={newTimeRange.startTime}
                      onChange={(e) => setNewTimeRange({ ...newTimeRange, startTime: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>종료 시간 *</Label>
                    <Input
                      type="time"
                      value={newTimeRange.endTime}
                      onChange={(e) => setNewTimeRange({ ...newTimeRange, endTime: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>요일</Label>
                  <Input
                    placeholder="예: 월, 화, 수, 목, 금"
                    value={newTimeRange.day}
                    onChange={(e) => setNewTimeRange({ ...newTimeRange, day: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>설명</Label>
                  <Textarea
                    placeholder="시간대에 대한 설명"
                    value={newTimeRange.description}
                    onChange={(e) => setNewTimeRange({ ...newTimeRange, description: e.target.value })}
                  />
                </div>
                <Button onClick={addTimeRange} className="w-full">
                  추가
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ips" className="space-y-4">
            <div className="space-y-4">
              {trustedIpRanges.map((ipRange) => (
                <Card key={ipRange.id}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{ipRange.name}</h4>
                          <Badge variant={ipRange.type === "whitelist" ? "default" : "destructive"}>
                            {ipRange.type === "whitelist" ? "화이트리스트" : "블랙리스트"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{ipRange.description}</p>
                        <p className="text-xs font-mono text-muted-foreground">{ipRange.ipRange}</p>
                      </div>
                      <Button variant="ghost" size="icon" onClick={() => removeIpRange(ipRange.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-dashed">
              <CardContent className="pt-6 space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  <Plus className="h-4 w-4" />새 IP 범위 추가
                </h4>
                <div className="space-y-2">
                  <Label>이름 *</Label>
                  <Input
                    placeholder="예: 본사 IP"
                    value={newIpRange.name}
                    onChange={(e) => setNewIpRange({ ...newIpRange, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>IP 범위 *</Label>
                  <Input
                    placeholder="예: 192.168.1.0/24 또는 10.0.0.1-10.0.0.255"
                    value={newIpRange.ipRange}
                    onChange={(e) => setNewIpRange({ ...newIpRange, ipRange: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>유형</Label>
                  <select
                    className="w-full border rounded-md p-2"
                    value={newIpRange.type}
                    onChange={(e) => setNewIpRange({ ...newIpRange, type: e.target.value })}
                  >
                    <option value="whitelist">화이트리스트</option>
                    <option value="blacklist">블랙리스트</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>설명</Label>
                  <Textarea
                    placeholder="IP 범위에 대한 설명"
                    value={newIpRange.description}
                    onChange={(e) => setNewIpRange({ ...newIpRange, description: e.target.value })}
                  />
                </div>
                <Button onClick={addIpRange} className="w-full">
                  추가
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
