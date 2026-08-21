import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { branches } from '../data/branches';

/**
 * Peta OpenStreetMap berisi penanda seluruh cabang.
 * Saat `selectedId` berubah, peta terbang dan memperbesar ke cabang tersebut.
 * Klik penanda di peta juga memilih cabang lewat `onSelect`.
 */

const ALL_COORDS = branches.map((branch) => branch.coords);
const FIT_OPTIONS = { padding: [50, 50], maxZoom: 14 };

/** Penanda peta dibuat dari HTML biasa supaya bisa diwarnai lewat CSS tema. */
const createPinIcon = (isActive) =>
  L.divIcon({
    className: 'map-pin-icon',
    html: `<span class="map-pin${isActive ? ' is-active' : ''}"></span>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -22],
  });

export default function BranchMap({ selectedId, onSelect }) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef({});

  // Efek pemilihan cabang di bawah juga ikut jalan pada render pertama. Tanpa
  // penanda ini, peta yang baru saja diposisikan lewat fitBounds langsung
  // dianimasikan ulang ke posisi yang sama, dan terlihat seperti bergetar.
  const isFirstRunRef = useRef(true);

  // Disimpan di ref supaya peta tidak perlu dibuat ulang saat prop berubah.
  const onSelectRef = useRef(onSelect);
  onSelectRef.current = onSelect;

  useEffect(() => {
    if (mapRef.current || !containerRef.current) return undefined;

    const map = L.map(containerRef.current, {
      // Scroll roda mouse dimatikan supaya tidak membajak scroll halaman.
      scrollWheelZoom: false,
      zoomControl: true,
    });

    // Tile CARTO "Voyager": gaya jalan, warna, dan ikon tempatnya paling mirip
    // Google Maps di antara penyedia tile gratis, dan boleh dipakai tanpa API key.
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      subdomains: 'abcd',
      maxZoom: 20,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    branches.forEach((branch) => {
      const marker = L.marker(branch.coords, {
        icon: createPinIcon(false),
        title: branch.name,
        alt: branch.name,
      })
        .addTo(map)
        .bindPopup(
          `<strong>${branch.name}</strong><br />${branch.address}<br /><small>${branch.hours}</small>`,
        );

      marker.on('click', () => onSelectRef.current?.(branch.id));
      markersRef.current[branch.id] = marker;
    });

    map.fitBounds(ALL_COORDS, FIT_OPTIONS);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = {};
      isFirstRunRef.current = true;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    Object.entries(markersRef.current).forEach(([id, marker]) => {
      marker.setIcon(createPinIcon(id === selectedId));
    });

    // Render pertama: peta sudah diposisikan oleh fitBounds di atas, jadi tidak
    // perlu dianimasikan lagi ke posisi yang sama.
    const isFirstRun = isFirstRunRef.current;
    isFirstRunRef.current = false;

    if (!selectedId) {
      if (isFirstRun) return;

      map.closePopup();
      map.flyToBounds(ALL_COORDS, { ...FIT_OPTIONS, duration: 0.8 });
      return;
    }

    const branch = branches.find((item) => item.id === selectedId);
    if (!branch) return;

    map.flyTo(branch.coords, 16, { duration: 1.1 });
    markersRef.current[selectedId]?.openPopup();
  }, [selectedId]);

  return <div className="branch-map" ref={containerRef} role="application" aria-label="Peta cabang Vitasari Bakery" />;
}
