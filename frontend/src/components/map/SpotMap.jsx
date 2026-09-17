import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Link } from 'react-router-dom';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const fishingIcon = L.divIcon({
  className: 'custom-pin',
  html: `<div style="
    background: linear-gradient(135deg, #2563eb, #06b6d4);
    width: 36px;
    height: 36px;
    border-radius: 50% 50% 50% 0;
    transform: rotate(-45deg);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    border: 2px solid white;
  ">
    <span style="transform: rotate(45deg); font-size: 16px;">🎣</span>
  </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

export default function SpotMap({
  spots = [],
  center = [-6.200000, 106.816666],
  zoom = 10,
  mode = 'view',
  onLocationSelect = null,
  selectedCoord = null,
  height = '420px',
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerGroupRef = useRef(null);
  const pickerMarkerRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const initialLat = selectedCoord ? selectedCoord.lat : center[0];
      const initialLng = selectedCoord ? selectedCoord.lng : center[1];

      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      }).addTo(map);

      const markerGroup = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
      markerGroupRef.current = markerGroup;

      if (mode === 'picker' && onLocationSelect) {
        map.on('click', (e) => {
          const { lat, lng } = e.latlng;
          onLocationSelect({ lat: Number(lat.toFixed(6)), lng: Number(lng.toFixed(6)) });
        });
      }
    }

    const map = mapInstanceRef.current;
    const markerGroup = markerGroupRef.current;

    if (mode === 'view' && markerGroup) {
      markerGroup.clearLayers();

      const validSpots = spots.filter((s) => s.latitude && s.longitude);

      validSpots.forEach((spot) => {
        const popupContent = `
          <div style="font-family: sans-serif; min-width: 180px;">
            <img src="${spot.image_url}" alt="${spot.name}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 6px;" />
            <span style="display: inline-block; padding: 2px 6px; font-size: 10px; font-weight: 600; border-radius: 4px; background: #e0f2fe; color: #0284c7; margin-bottom: 4px;">
              ${spot.category}
            </span>
            <h4 style="margin: 0 0 2px 0; font-size: 13px; font-weight: 700; color: #1e293b;">${spot.name}</h4>
            <p style="margin: 0 0 8px 0; font-size: 11px; color: #64748b;">📍 ${spot.location}</p>
            <a href="/detail/${spot.id}" style="display: block; text-align: center; background: #2563eb; color: white; text-decoration: none; padding: 5px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;">
              Lihat Detail
            </a>
          </div>
        `;

        L.marker([spot.latitude, spot.longitude], { icon: fishingIcon })
          .bindPopup(popupContent)
          .addTo(markerGroup);
      });

      if (validSpots.length > 0) {
        const bounds = L.latLngBounds(validSpots.map((s) => [s.latitude, s.longitude]));
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 13 });
      }
    }

    if (mode === 'picker') {
      if (selectedCoord && selectedCoord.lat && selectedCoord.lng) {
        if (!pickerMarkerRef.current) {
          pickerMarkerRef.current = L.marker([selectedCoord.lat, selectedCoord.lng], { icon: fishingIcon })
            .addTo(map)
            .bindPopup('Lokasi Spot Mancing')
            .openPopup();
        } else {
          pickerMarkerRef.current.setLatLng([selectedCoord.lat, selectedCoord.lng]);
        }
        map.panTo([selectedCoord.lat, selectedCoord.lng]);
      }
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 250);

  }, [spots, mode, selectedCoord]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner z-0">
      <div ref={mapContainerRef} style={{ width: '100%', height }} />
      {mode === 'picker' && (
        <div className="absolute bottom-3 left-3 z-[1000] bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-md border border-slate-200 text-xs font-medium text-slate-700 flex items-center gap-1.5 pointer-events-none">
          <span>💡</span> Klik titik di peta untuk menentukan koordinat spot
        </div>
      )}
    </div>
  );
}
