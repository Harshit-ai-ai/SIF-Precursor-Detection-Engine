import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
import { 
  AlertTriangle, 
  Activity, 
  Map, 
  FileText, 
  ShieldAlert,
  Search,
  Info,
  Bell,
  X
} from 'lucide-react';

type Report = {
  id: string;
  date: string;
  site: string;
  loggedSeverity: string;
  predictedPotential: string;
  hiddenRisk: string;
  text: string;
  energy: string;
  exposure: string;
  barrier: string;
};

type Alert = {
  id: number;
  site: string;
  activity: string;
  barrier: string;
  drift: string;
  severity: string;
};

const hriData = [
  { site: 'Rig Alpha', hri: 4.2, baseline: 2.0 },
  { site: 'Refinery South', hri: 3.8, baseline: 1.5 },
  { site: 'Pipeline North', hri: 2.1, baseline: 2.2 },
  { site: 'Rig Beta', hri: 1.5, baseline: 1.8 },
];

const driftAlerts: Alert[] = [
  { id: 1, site: 'Rig Alpha', activity: 'Lifting', barrier: 'Exclusion Zone', drift: '+45%', severity: 'High' },
  { id: 2, site: 'Refinery South', activity: 'Hot Work', barrier: 'Gas Monitoring', drift: '+30%', severity: 'Medium' },
];

const lsrData = [
  { rule: 'Bypassing Safety Controls', count: 12 },
  { rule: 'Line of Fire', count: 9 },
  { rule: 'Work Authorization', count: 7 },
  { rule: 'Energy Isolation', count: 4 },
];

const recentReports = [
  { 
    id: 'RPT-1042', 
    date: '2026-09-28',
    site: 'Rig Alpha',
    loggedSeverity: 'Minor',
    predictedPotential: 'Fatal',
    hiddenRisk: 'High',
    text: "During scaffolding removal, a 5kg scaffolding tube slipped and fell 10 meters, landing near a worker who had briefly stepped outside the exclusion zone. No injury sustained as the worker was wearing a hard hat.",
    energy: "Gravity (falling object)",
    exposure: "Person briefly in line of fire (outside exclusion zone)",
    barrier: "Exclusion zone (failed/bypassed), Hard hat (held)",
  },
  {
    id: 'RPT-1043',
    date: '2026-10-01',
    site: 'Refinery South',
    loggedSeverity: 'Near Miss',
    predictedPotential: 'Severe',
    hiddenRisk: 'High',
    text: "Spark noticed during hot work near an empty tank. Hot work permit was in place but continuous gas monitoring equipment was showing intermittent faults earlier in the shift.",
    energy: "Flammable/Thermal",
    exposure: "Worker in immediate hazard zone",
    barrier: "Gas monitoring (failed), Hot work permit (held)",
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [alerts, setAlerts] = useState(driftAlerts);
  const [toastAlerts, setToastAlerts] = useState(driftAlerts);
  const [isBellOpen, setIsBellOpen] = useState(false);

  const dismissToast = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setToastAlerts(toastAlerts.filter(a => a.id !== id));
  };

  const dismissAlert = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setAlerts(alerts.filter(a => a.id !== id));
    setToastAlerts(toastAlerts.filter(a => a.id !== id));
  };

  const openAlertContext = (alert: Alert) => {
    setActiveTab('reports');
    setSelectedAlert(alert);
    setSelectedReport(null);
    setIsBellOpen(false);
  };

  const renderDashboard = () => (
    <div className="space-y-6">
      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Avg Hidden-Risk Index</h3>
            <Activity className="w-5 h-5 text-indigo-500" />
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-800">2.9</div>
          <div className="mt-1 text-sm text-green-500">-0.2 from last month</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Active Drift Alerts</h3>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-800">2</div>
          <div className="mt-1 text-sm text-gray-500">Requires HSE review</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">LSR Violations (Predicted)</h3>
            <ShieldAlert className="w-5 h-5 text-red-500" />
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-800">32</div>
          <div className="mt-1 text-sm text-red-500">+4 from last week</div>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between">
            <h3 className="text-gray-500 text-sm font-medium">Processed Reports</h3>
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-2 text-3xl font-bold text-gray-800">1,452</div>
          <div className="mt-1 text-sm text-gray-500">Last 30 days</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hidden Risk Index Chart */}
        <div className="bg-white p-4 rounded shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Site Ranking by Hidden-Risk Index</h3>
            <Info className="w-4 h-4 text-gray-400" />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hriData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="site" />
                <YAxis />
                <RechartsTooltip />
                <Legend />
                <Bar dataKey="hri" name="Current HRI" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                <Bar dataKey="baseline" name="Historical Baseline" fill="#9ca3af" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* LSR Heatmap (Simulated with Bar Chart for now) */}
        <div className="bg-white p-4 rounded shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Life-Saving Rules Coverage</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={lsrData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" />
                <YAxis dataKey="rule" type="category" width={150} tick={{fontSize: 12}} />
                <RechartsTooltip />
                <Bar dataKey="count" fill="#ec4899" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

    </div>
  );

  const renderReports = () => (
    <div className="flex h-[calc(100vh-120px)] bg-white rounded shadow overflow-hidden">
      {/* Report List */}
      <div className="w-1/3 border-r overflow-y-auto">
        <div className="p-4 border-b bg-gray-50">
          <h3 className="font-semibold text-gray-700">Triage Queue</h3>
          <p className="text-xs text-gray-500 mt-1">High potential severity, low reported severity</p>
        </div>
        <ul className="divide-y divide-gray-100">
          {alerts.map(alert => (
            <li 
              key={`alert-${alert.id}`} 
              className={`p-4 hover:bg-orange-50 cursor-pointer ${selectedAlert?.id === alert.id ? 'bg-orange-50 border-l-4 border-orange-500' : ''}`}
              onClick={() => { setSelectedAlert(alert); setSelectedReport(null); }}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm text-orange-700">Drift Alert: {alert.barrier}</span>
                <span className="text-xs font-bold text-red-600">{alert.drift}</span>
              </div>
              <p className="text-sm text-gray-800 mb-2 truncate">{alert.site}</p>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-800 uppercase">Early Warning</span>
              </div>
            </li>
          ))}
          {recentReports.map(report => (
            <li 
              key={report.id} 
              className={`p-4 hover:bg-indigo-50 cursor-pointer ${selectedReport?.id === report.id ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''}`}
              onClick={() => { setSelectedReport(report); setSelectedAlert(null); }}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-sm text-indigo-700">{report.id}</span>
                <span className="text-xs text-gray-500">{report.date}</span>
              </div>
              <p className="text-sm text-gray-800 mb-2 truncate">{report.site}</p>
              <div className="flex gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600">Logged: {report.loggedSeverity}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700">Predicted: {report.predictedPotential}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      {/* Report Details */}
      <div className="w-2/3 p-6 overflow-y-auto">
        {selectedAlert ? (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Drift Alert: {selectedAlert.barrier}</h2>
                <p className="text-gray-500">{selectedAlert.site} | {selectedAlert.activity}</p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded p-3 text-center">
                <div className="text-xs font-semibold text-orange-600 uppercase tracking-wide">Drift Rate</div>
                <div className="text-xl font-bold text-orange-700">{selectedAlert.drift}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Early Warning Context</h3>
              <p className="text-gray-800 text-sm leading-relaxed">
                The barrier <strong>{selectedAlert.barrier}</strong> is failing at an elevated rate during <strong>{selectedAlert.activity}</strong> at <strong>{selectedAlert.site}</strong>. 
                This drift alert was triggered by the CUSUM change-point detection algorithm, indicating a {selectedAlert.drift} increase in failure rate over the historical baseline.
              </p>
              <p className="text-gray-800 text-sm leading-relaxed mt-2">
                Immediate investigation into site procedures is recommended to prevent a potential Serious Injury or Fatality (SIF).
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t flex justify-end gap-3">
              <button className="px-4 py-2 border rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Dismiss Alert
              </button>
              <button className="px-4 py-2 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Initiate Investigation
              </button>
            </div>
          </div>
        ) : selectedReport ? (
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedReport.id}</h2>
                <p className="text-gray-500">{selectedReport.site} | {selectedReport.date}</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded p-3 text-center">
                <div className="text-xs font-semibold text-red-600 uppercase tracking-wide">Hidden Risk</div>
                <div className="text-xl font-bold text-red-700">{selectedReport.hiddenRisk}</div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg border mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Original Narrative</h3>
              <p className="text-gray-800 text-sm leading-relaxed">
                {selectedReport.text}
              </p>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Fields (Explainable Core)</h3>
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-gray-800">Energy Source</span>
                </div>
                <p className="text-sm text-gray-600">{selectedReport.energy}</p>
              </div>
              
              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <Map className="w-4 h-4 text-blue-500" />
                  <span className="font-semibold text-gray-800">Exposure</span>
                </div>
                <p className="text-sm text-gray-600">{selectedReport.exposure}</p>
              </div>

              <div className="border rounded-lg p-4 bg-white shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldAlert className="w-4 h-4 text-green-500" />
                  <span className="font-semibold text-gray-800">Barrier State</span>
                </div>
                <p className="text-sm text-gray-600">{selectedReport.barrier}</p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t flex justify-end gap-3">
              <button className="px-4 py-2 border rounded shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                Flag for False Positive
              </button>
              <button className="px-4 py-2 border border-transparent rounded shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Confirm & Escalate
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Search className="w-12 h-12 mb-4 text-gray-300" />
            <p>Select a report or alert to view details</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white flex flex-col">
        <div className="p-4 border-b border-indigo-800">
          <h1 className="text-xl font-bold tracking-wider">SIF ENGINE</h1>
          <p className="text-indigo-300 text-xs mt-1">Precursor Detection Engine</p>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeTab === 'dashboard' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
          >
            <Activity className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
          <button 
            onClick={() => setActiveTab('reports')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded transition-colors ${activeTab === 'reports' ? 'bg-indigo-800 text-white' : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'}`}
          >
            <FileText className="w-5 h-5" />
            <span>Triage & Review</span>
          </button>
        </nav>
        <div className="p-4 border-t border-indigo-800 text-xs text-indigo-400">
          System operational • v1.0
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Toast Notifications */}
        <div className="fixed top-20 right-6 z-50 flex flex-col gap-2 w-80">
          {toastAlerts.map(alert => (
             <div 
               key={alert.id} 
               onClick={() => openAlertContext(alert)}
               className="bg-white border-l-4 border-orange-500 shadow-lg rounded p-3 relative cursor-pointer hover:bg-orange-50 transition-colors"
             >
               <button onClick={(e) => dismissToast(e, alert.id)} className="absolute top-2 right-2 text-gray-400 hover:text-gray-600">
                 <X className="w-4 h-4" />
               </button>
               <div className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-orange-500" />
                  Drift Alert
               </div>
               <div className="text-xs text-gray-600 mt-1">
                 {alert.site}: {alert.barrier} ({alert.drift})
               </div>
             </div>
          ))}
        </div>

        <header className="bg-white shadow-sm border-b px-6 py-4 flex justify-between items-center relative">
          <h2 className="text-xl font-semibold text-gray-800">
            {activeTab === 'dashboard' ? 'Overview Dashboard' : 'Human-in-the-Loop Triage'}
          </h2>
          <div className="flex items-center gap-4 relative">
            <div className="relative">
              <button onClick={() => setIsBellOpen(!isBellOpen)} className="p-2 text-gray-500 hover:text-gray-700 relative flex items-center justify-center">
                <Bell className="w-5 h-5" />
                {alerts.length > 0 && (
                  <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </button>
              {isBellOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg border z-50">
                  <div className="p-3 border-b font-semibold text-gray-700">Notifications</div>
                  <div className="max-h-96 overflow-y-auto">
                    {alerts.length === 0 ? (
                       <div className="p-4 text-sm text-gray-500 text-center">No new notifications</div>
                    ) : (
                       alerts.map(alert => (
                         <div 
                           key={alert.id} 
                           onClick={() => openAlertContext(alert)}
                           className="p-3 border-b hover:bg-orange-50 cursor-pointer transition-colors"
                         >
                           <div className="flex justify-between items-start">
                             <div className="text-sm font-medium text-gray-800">{alert.site} - {alert.activity}</div>
                             <button onClick={(e) => dismissAlert(e, alert.id)} className="text-gray-400 hover:text-gray-600">
                               <X className="w-4 h-4"/>
                             </button>
                           </div>
                           <div className="text-xs text-gray-600 mt-1">Barrier: {alert.barrier} degraded by {alert.drift}</div>
                           <div className="text-xs text-indigo-600 font-medium mt-2">Click to investigate</div>
                         </div>
                       ))
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="text-sm text-gray-500">HSE Reviewer Mode</div>
            <div className="w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold">
              HR
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {activeTab === 'dashboard' ? renderDashboard() : renderReports()}
        </main>
      </div>
    </div>
  );
}
