import React from 'react';
import { MapPin, AlertOctagon, Users, Bell } from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
export function CommunityAlerts() {
  // Taita Taveta County center coordinates
  const center: [number, number] = [-3.3167, 38.35];
  // Mock outbreak locations
  const outbreaks = [{
    id: 1,
    name: 'Fall Armyworm',
    position: [-3.3, 38.36] as [number, number],
    distance: '2.5 km',
    reports: 12,
    severity: 'high'
  }, {
    id: 2,
    name: 'Maize Lethal Necrosis',
    position: [-3.35, 38.4] as [number, number],
    distance: '15 km',
    reports: 5,
    severity: 'medium'
  }];
  return <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-[#1f2933]">Alerts</h2>
        <div className="relative">
          <Bell className="w-6 h-6 text-[#1f2933]" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#f5f5f7]" />
        </div>
      </div>

      {/* OpenStreetMap */}
      <div className="w-full h-64 border-2 border-gray-400 rounded-lg overflow-hidden relative">
        <MapContainer center={center} zoom={11} style={{
        height: '100%',
        width: '100%'
      }} zoomControl={true}>
          <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" className="grayscale opacity-80" />

          {outbreaks.map(outbreak => <CircleMarker key={outbreak.id} center={outbreak.position} radius={outbreak.severity === 'high' ? 12 : 8} pathOptions={{
          color: outbreak.severity === 'high' ? '#dc2626' : '#f97316',
          fillColor: outbreak.severity === 'high' ? '#dc2626' : '#f97316',
          fillOpacity: 0.6,
          weight: 2
        }}>
              <Popup>
                <div className="font-mono text-xs">
                  <div className="font-bold">{outbreak.name}</div>
                  <div className="text-gray-600">
                    {outbreak.reports} reports
                  </div>
                </div>
              </Popup>
            </CircleMarker>)}
        </MapContainer>

        {/* Map Label Overlay */}
        <div className="absolute top-2 left-2 bg-white/90 px-2 py-1 text-xs font-mono border border-gray-300 pointer-events-none">
          Taita Taveta Region
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-mono text-xs text-gray-500 uppercase tracking-wider">
          Recent Outbreaks
        </h3>

        {/* Alert 1 */}
        <div className="border-l-4 border-red-500 bg-white p-4 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-lg text-red-700 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5" />
              Fall Armyworm
            </h4>
            <span className="font-mono text-xs text-gray-500">2h ago</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <span className="block font-mono text-xs text-gray-400">
                Distance
              </span>
              <span className="font-bold text-[#1f2933]">2.5 km away</span>
            </div>
            <div>
              <span className="block font-mono text-xs text-gray-400">
                Reports
              </span>
              <span className="font-bold text-[#1f2933]">12 Farmers</span>
            </div>
          </div>
        </div>

        {/* Alert 2 */}
        <div className="border-l-4 border-orange-400 bg-white p-4 shadow-sm opacity-75">
          <div className="flex justify-between items-start mb-2">
            <h4 className="font-bold text-lg text-orange-700 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5" />
              Maize Lethal Necrosis
            </h4>
            <span className="font-mono text-xs text-gray-500">1d ago</span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-3">
            <div>
              <span className="block font-mono text-xs text-gray-400">
                Distance
              </span>
              <span className="font-bold text-[#1f2933]">15 km away</span>
            </div>
            <div>
              <span className="block font-mono text-xs text-gray-400">
                Reports
              </span>
              <span className="font-bold text-[#1f2933]">5 Farmers</span>
            </div>
          </div>
        </div>

        {/* Community Stat */}
        <div className="border-2 border-dashed border-gray-300 p-4 flex items-center gap-4 mt-6">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
            <Users className="w-6 h-6 text-gray-600" />
          </div>
          <div>
            <div className="font-bold text-lg">450+ Farmers</div>
            <div className="text-sm text-gray-600">Active in your area</div>
          </div>
        </div>
      </div>
    </div>;
}