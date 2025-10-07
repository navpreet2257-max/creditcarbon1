import React, { useState } from 'react';
import { BarChart3, TrendingUp, Award, Download, Calendar, Target, Leaf, Users } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockDashboardData, mockCertificates, mockPaymentHistory } from '../mock/data';
import { toast } from 'sonner';

export const DashboardPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const data = mockDashboardData;

  const downloadCertificate = (certificateId) => {
    toast.success(`Certificate ${certificateId} downloaded successfully!`);
  };

  const generateReport = () => {
    toast.success('Carbon footprint report generated and sent to your email!');
  };

  const periods = [
    { value: '1month', label: 'Last Month' },
    { value: '3months', label: 'Last 3 Months' },
    { value: '6months', label: 'Last 6 Months' },
    { value: '1year', label: 'Last Year' }
  ];

  return (
    <div className="min-h-screen pt-20">
      <div className="container section-padding">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="heading-1 mb-2">Carbon Neutral Dashboard</h1>
              <p className="body-large" style={{ color: 'var(--text-secondary)' }}>
                Track your progress towards carbon neutrality and view your environmental impact
              </p>
            </div>
            <div className="flex gap-3">
              <Button onClick={generateReport} variant="outline" className="btn-secondary">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 body-medium"
              >
                {periods.map(period => (
                  <option key={period.value} value={period.value}>
                    {period.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Status Banner */}
          <Card className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="heading-3 text-green-800">🎉 Carbon Neutral Certified!</h3>
                    <p className="body-medium text-green-700">
                      Your business has successfully achieved carbon neutrality as of {data.carbonNeutralDate}
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white px-4 py-2">
                  CERTIFIED
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6 text-center">
              <Leaf className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--accent-primary)' }} />
              <div className="heading-2" style={{ color: 'var(--accent-text)' }}>
                {data.totalFootprint}
              </div>
              <div className="body-small">Tons CO₂ Annual Footprint</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Target className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--accent-primary)' }} />
              <div className="heading-2" style={{ color: 'var(--accent-text)' }}>
                {data.offsetCredits}
              </div>
              <div className="body-small">Carbon Credits Purchased</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <TrendingUp className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--accent-primary)' }} />
              <div className="heading-2" style={{ color: 'var(--accent-text)' }}>
                {data.projectsSupported}
              </div>
              <div className="body-small">Projects Supported</div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6 text-center">
              <Award className="w-8 h-8 mx-auto mb-3" style={{ color: 'var(--accent-primary)' }} />
              <div className="heading-2" style={{ color: 'var(--accent-text)' }}>
                {data.certificatesEarned}
              </div>
              <div className="body-small">Certificates Earned</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="certificates">Certificates</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Progress Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="heading-3 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Monthly Emissions vs Offsets
                  </CardTitle>
                  <CardDescription>
                    Track your carbon footprint and offset progress over time
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {data.monthlyProgress.map((month, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{month.month}</span>
                          <span>
                            {month.footprint} tons / {month.offset} credits
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="flex h-2 rounded-full overflow-hidden">
                            <div 
                              className="bg-red-400" 
                              style={{ width: `${(month.footprint / 120) * 100}%` }}
                            ></div>
                            <div 
                              className="bg-green-500" 
                              style={{ width: `${(month.offset / 120) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                      <span>Emissions</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Offsets</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Environmental Impact */}
              <Card>
                <CardHeader>
                  <CardTitle className="heading-3">Environmental Impact</CardTitle>
                  <CardDescription>
                    Your carbon offset contribution equivalent to:
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🌳</div>
                      <div>
                        <div className="body-medium font-semibold">Trees Planted</div>
                        <div className="body-small" style={{ color: 'var(--text-secondary)' }}>
                          Carbon absorption equivalent
                        </div>
                      </div>
                    </div>
                    <div className="heading-3" style={{ color: 'var(--accent-text)' }}>
                      {data.impactMetrics.treesEquivalent.toLocaleString()}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🚗</div>
                      <div>
                        <div className="body-medium font-semibold">Cars Off Road</div>
                        <div className="body-small" style={{ color: 'var(--text-secondary)' }}>
                          Annual emission reduction
                        </div>
                      </div>
                    </div>
                    <div className="heading-3 text-blue-600">
                      {data.impactMetrics.carsOffRoad}
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">🏠</div>
                      <div>
                        <div className="body-medium font-semibold">Homes Powered</div>
                        <div className="body-small" style={{ color: 'var(--text-secondary)' }}>
                          Clean energy equivalent
                        </div>
                      </div>
                    </div>
                    <div className="heading-3 text-yellow-600">
                      {data.impactMetrics.homesAnnualEnergy}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="heading-3">Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4 p-3 border-l-4 border-green-500 bg-green-50">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div className="flex-1">
                    <div className="body-medium font-semibold">Certificate Renewed</div>
                    <div className="body-small" style={{ color: 'var(--text-secondary)' }}>
                      Your carbon neutral certificate has been renewed for another year
                    </div>
                  </div>
                  <div className="body-small text-green-600">2 days ago</div>
                </div>

                <div className="flex items-center gap-4 p-3 border-l-4 border-blue-500 bg-blue-50">
                  <Target className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <div className="body-medium font-semibold">Credits Purchased</div>
                    <div className="body-small" style={{ color: 'var(--text-secondary)' }}>
                      Purchased 130 credits from Amazon Rainforest Conservation project
                    </div>
                  </div>
                  <div className="body-small text-blue-600">1 week ago</div>
                </div>

                <div className="flex items-center gap-4 p-3 border-l-4 border-purple-500 bg-purple-50">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                  <div className="flex-1">
                    <div className="body-medium font-semibold">Footprint Calculated</div>
                    <div className="body-small" style={{ color: 'var(--text-secondary)' }}>
                      Monthly carbon footprint updated: 102 tons CO₂
                    </div>
                  </div>
                  <div className="body-small text-purple-600">2 weeks ago</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-3">Carbon Neutrality Progress</CardTitle>
                    <CardDescription>
                      Monthly breakdown of emissions and offsets
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {data.monthlyProgress.map((month, index) => (
                        <div key={index} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="body-medium font-semibold">{month.month} 2024</span>
                            <div className="flex items-center gap-4">
                              <span className="body-small text-red-600">
                                {month.footprint} tons emitted
                              </span>
                              <span className="body-small text-green-600">
                                {month.offset} credits offset
                              </span>
                              {month.offset >= month.footprint && (
                                <Badge className="bg-green-100 text-green-800">✓ Neutral</Badge>
                              )}
                            </div>
                          </div>
                          <div className="relative">
                            <div className="w-full bg-red-200 rounded-full h-3">
                              <div 
                                className="bg-red-500 h-3 rounded-full relative"
                                style={{ width: `${(month.footprint / 120) * 100}%` }}
                              >
                                <div 
                                  className="absolute top-0 right-0 bg-green-500 h-3 rounded-full"
                                  style={{ width: `${Math.min(100, (month.offset / month.footprint) * 100)}%` }}
                                ></div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="heading-3">Next Steps</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="body-medium font-semibold text-blue-800 mb-1">
                        📊 Quarterly Review
                      </div>
                      <div className="body-small text-blue-700">
                        Schedule your Q3 carbon assessment
                      </div>
                      <Button size="sm" className="mt-2 w-full" variant="outline">
                        Schedule Now
                      </Button>
                    </div>

                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="body-medium font-semibold text-green-800 mb-1">
                        🌱 New Projects
                      </div>
                      <div className="body-small text-green-700">
                        3 new offset projects match your preferences
                      </div>
                      <Button size="sm" className="mt-2 w-full" variant="outline">
                        View Projects
                      </Button>
                    </div>

                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="body-medium font-semibold text-yellow-800 mb-1">
                        📝 Report Due
                      </div>
                      <div className="body-small text-yellow-700">
                        Annual sustainability report in 30 days
                      </div>
                      <Button size="sm" className="mt-2 w-full" variant="outline">
                        Start Report
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="heading-3">Achievements</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center text-sm">🏆</div>
                      <div>
                        <div className="body-small font-semibold">Carbon Neutral Pioneer</div>
                        <div className="caption">First 100 certified businesses</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">🌿</div>
                      <div>
                        <div className="body-small font-semibold">Forest Guardian</div>
                        <div className="caption">Supported 5+ forest projects</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">⚡</div>
                      <div>
                        <div className="body-small font-semibold">Clean Energy Champion</div>
                        <div className="caption">1000+ renewable credits</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Certificates Tab */}
          <TabsContent value="certificates" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {mockCertificates.map((cert) => (
                <Card key={cert.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="heading-3">{cert.type}</CardTitle>
                        <CardDescription>Certificate ID: {cert.id}</CardDescription>
                      </div>
                      <Badge className={cert.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                        {cert.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Issue Date:</span>
                        <div>{cert.issueDate}</div>
                      </div>
                      <div>
                        <span className="font-medium">Valid Until:</span>
                        <div>{cert.validUntil}</div>
                      </div>
                      <div>
                        <span className="font-medium">Credits Offset:</span>
                        <div>{cert.creditsOffset} tons CO₂</div>
                      </div>
                      <div>
                        <span className="font-medium">Business:</span>
                        <div>{cert.businessName}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => downloadCertificate(cert.id)}
                        className="btn-primary flex-1"
                        size="sm"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button variant="outline" className="btn-secondary flex-1" size="sm">
                        Get Digital Badge
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="heading-3">Certificate Benefits</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Award className="w-8 h-8 mx-auto mb-2 text-green-600" />
                  <div className="body-medium font-semibold">Marketing Use</div>
                  <div className="body-small">Display certificates on your website and marketing materials</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Users className="w-8 h-8 mx-auto mb-2 text-blue-600" />
                  <div className="body-medium font-semibold">Customer Trust</div>
                  <div className="body-small">Build credibility with environmentally conscious consumers</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 text-purple-600" />
                  <div className="body-medium font-semibold">Compliance</div>
                  <div className="body-small">Meet regulatory requirements and industry standards</div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="heading-3">Payment History</CardTitle>
                <CardDescription>
                  Track all your carbon credit purchases and transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockPaymentHistory.map((payment) => (
                    <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <Leaf className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <div className="body-medium font-semibold">{payment.project}</div>
                          <div className="body-small" style={{ color: 'var(--text-secondary)' }}>
                            {payment.credits} credits • {payment.date}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="body-medium font-semibold">${payment.amount.toFixed(2)}</div>
                        <Badge className={payment.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}>
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="heading-3">Payment Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="body-medium">Total Spent:</span>
                    <span className="body-medium font-semibold">
                      ${mockPaymentHistory.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-medium">Total Credits:</span>
                    <span className="body-medium font-semibold">
                      {mockPaymentHistory.reduce((sum, p) => sum + p.credits, 0)} credits
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-medium">Average Price:</span>
                    <span className="body-medium font-semibold">
                      ${(mockPaymentHistory.reduce((sum, p) => sum + p.amount, 0) / mockPaymentHistory.reduce((sum, p) => sum + p.credits, 0)).toFixed(2)}/credit
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="heading-3">Auto-Renewal Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="body-medium">Monthly Auto-Purchase:</span>
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-medium">Monthly Budget:</span>
                    <span className="body-medium font-semibold">$2,000</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="body-medium">Next Purchase:</span>
                    <span className="body-medium">July 1, 2024</span>
                  </div>
                  <Button variant="outline" className="w-full">
                    Modify Settings
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};