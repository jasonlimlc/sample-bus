/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TopAppBar } from './components/TopAppBar';
import { SearchBar } from './components/SearchBar';
import { NearestStopSpotlight } from './components/NearestStopSpotlight';
import { RouteStepper } from './components/RouteStepper';
import { GeoVectorMap } from './components/GeoVectorMap';
import { OperatingProfile } from './components/OperatingProfile';
import { ColocatedBuses } from './components/ColocatedBuses';
import { WalkGuideModal } from './components/WalkGuideModal';
import { RemindModal } from './components/RemindModal';
import { FullscreenMapModal } from './components/FullscreenMapModal';
import { NearbyView } from './components/NearbyView';
import { AlertsView } from './components/AlertsView';
import { SavedView } from './components/SavedView';
import { BottomNavBar } from './components/BottomNavBar';
import {
  BUS_SERVICES,
  ROUTE_147_STOPS_DIR1,
  TRANSPONDER_VEHICLES_LINE_147,
  COLOCATED_BUSES_STOP_08031,
  NEARBY_BUS_STOPS,
} from './data/transitData';
import { BusStop, BusArrivalPrediction, TransponderVehicle, ColocatedBus } from './types/transit';
import {
  fetchLTABusArrivals,
  parseLTAPredictions,
  extractColocatedBusesFromLTA,
} from './services/ltaService';

export default function App() {
  // Navigation & View Tab
  const [currentTab, setCurrentTab] = useState<'routes' | 'nearby' | 'alerts' | 'saved'>('routes');

  // Active Transit Route
  const [activeServiceNumber, setActiveServiceNumber] = useState<string>('147');
  const [activeDirection, setActiveDirection] = useState<1 | 2>(1);
  const [searchQuery, setSearchQuery] = useState<string>('147');
  const [showNearestStop, setShowNearestStop] = useState<boolean>(true);

  // Active Spotlight Stop (default Dhoby Ghaut Exit B)
  const defaultStop = ROUTE_147_STOPS_DIR1[1]; // 08031
  const [activeStop, setActiveStop] = useState<BusStop>(defaultStop);

  // Bookmarked Stops
  const [savedStops, setSavedStops] = useState<BusStop[]>([defaultStop]);

  // Co-located buses dynamically fetched or defaulted
  const [colocatedBuses, setColocatedBuses] = useState<ColocatedBus[]>(COLOCATED_BUSES_STOP_08031);

  // Live Arrival Predictions
  const [predictions, setPredictions] = useState<BusArrivalPrediction[]>([
    {
      etaMinutes: 0,
      plateNumber: 'SBS3482D',
      deckType: 'Double-Decker',
      crowdLevel: 'seats-available',
      wheelchairAccessible: true,
    },
    {
      etaMinutes: 7,
      plateNumber: 'SBS7721X',
      deckType: 'Double-Decker',
      crowdLevel: 'standing-available',
      wheelchairAccessible: true,
    },
    {
      etaMinutes: 18,
      plateNumber: 'SBS8109J',
      deckType: 'Single Deck',
      crowdLevel: 'seats-available',
      wheelchairAccessible: true,
    },
  ]);

  // Live Transponders
  const [transponders, setTransponders] = useState<TransponderVehicle[]>(
    TRANSPONDER_VEHICLES_LINE_147
  );

  // Live Seconds Telemetry Ticker
  const [secondsSinceUpdate, setSecondsSinceUpdate] = useState<number>(4);

  // Modals
  const [isWalkGuideOpen, setIsWalkGuideOpen] = useState<boolean>(false);
  const [isRemindOpen, setIsRemindOpen] = useState<boolean>(false);
  const [isFullscreenMapOpen, setIsFullscreenMapOpen] = useState<boolean>(false);

  // Toast Notification Message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Fetch real-time LTA Bus Arrival information
  const loadLTAData = async (isManual = false) => {
    try {
      const data = await fetchLTABusArrivals(activeStop.code, activeServiceNumber);
      if (data && data.Services && data.Services.length > 0) {
        const targetService = data.Services.find(
          (s) => s.ServiceNo.toLowerCase() === activeServiceNumber.toLowerCase()
        ) || data.Services[0];

        const parsed = parseLTAPredictions(targetService);
        if (parsed.length > 0) {
          setPredictions(parsed);
        }

        const others = extractColocatedBusesFromLTA(data.Services, activeServiceNumber);
        if (others.length > 0) {
          setColocatedBuses(others);
        }
      }
      setSecondsSinceUpdate(1);
      if (isManual) {
        showToast('Live telemetry synchronized with LTA Datamall v3');
      }
    } catch (err) {
      console.warn('LTA arrivals fetch issue:', err);
    }
  };

  // Clock telemetry ticker & 20-second LTA refresh cycle
  useEffect(() => {
    loadLTAData();

    // 20-second LTA API polling cycle matching the LTA specification
    const ltaPolling = setInterval(() => {
      loadLTAData();
    }, 20000);

    const timer = setInterval(() => {
      setSecondsSinceUpdate((prev) => prev + 1);
    }, 1000);

    return () => {
      clearInterval(ltaPolling);
      clearInterval(timer);
    };
  }, [activeStop.code, activeServiceNumber]);

  const handleManualRefresh = () => {
    loadLTAData(true);
  };

  const handleLocateUser = () => {
    showToast('GPS recalibrated: Somerset / Orchard area, Singapore • ±4.8m accuracy');
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Check service numbers
    if (BUS_SERVICES[query]) {
      setActiveServiceNumber(query);
      setCurrentTab('routes');
      showToast(`Switched tracking to Service ${query}`);
      return;
    }

    // Check stop code
    const matchingStop = ROUTE_147_STOPS_DIR1.find((s) => s.code.toLowerCase() === query) ||
      NEARBY_BUS_STOPS.find((s) => s.code.toLowerCase() === query);

    if (matchingStop) {
      setActiveStop(matchingStop);
      setCurrentTab('routes');
      showToast(`Selected stop ${matchingStop.name} (${matchingStop.code})`);
      return;
    }

    // Road name or stop name match
    const matchingName = ROUTE_147_STOPS_DIR1.find(
      (s) => s.name.toLowerCase().includes(query) || s.roadName.toLowerCase().includes(query)
    );

    if (matchingName) {
      setActiveStop(matchingName);
      setCurrentTab('routes');
      showToast(`Located ${matchingName.name}`);
      return;
    }

    showToast(`Service "${query}" loaded in active transit registry`);
  };

  const handleSelectService = (serviceNum: string) => {
    setActiveServiceNumber(serviceNum);
    setSearchQuery(serviceNum);
    setCurrentTab('routes');
    showToast(`Switched tracking to Service ${serviceNum}`);
  };

  const handleSelectStop = (stop: BusStop) => {
    setActiveStop(stop);
    setCurrentTab('routes');
    showToast(`Now tracking arrivals at ${stop.name} (${stop.code})`);
  };

  const handleToggleSaveStop = () => {
    const exists = savedStops.some((s) => s.code === activeStop.code);
    if (exists) {
      setSavedStops(savedStops.filter((s) => s.code !== activeStop.code));
      showToast(`Removed ${activeStop.name} from saved stops`);
    } else {
      setSavedStops([...savedStops, activeStop]);
      showToast(`Saved ${activeStop.name} to commute favorites`);
    }
  };

  const handleRemoveSavedStop = (code: string) => {
    setSavedStops(savedStops.filter((s) => s.code !== code));
    showToast('Stop removed from saved list');
  };

  const handleSetReminder = (minutes: number) => {
    showToast(
      minutes === 0
        ? `Alarm activated: We'll chime when Bus ${activeServiceNumber} arrives at ${activeStop.name}!`
        : `Alarm activated: We'll chime ${minutes} mins before Bus ${activeServiceNumber} arrives!`
    );
  };

  const currentService = BUS_SERVICES[activeServiceNumber] || BUS_SERVICES['147'];
  const isCurrentStopSaved = savedStops.some((s) => s.code === activeStop.code);

  return (
    <div className="bg-surface text-on-surface antialiased min-h-screen flex flex-col font-body-md text-body-md selection:bg-primary-fixed selection:text-on-primary-fixed pb-20 md:pb-8">
      {/* Toast Alert Pop-in */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-on-surface text-surface-canvas text-xs font-semibold px-4 py-2.5 rounded-full shadow-2xl flex items-center gap-2 border border-white/20 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-status-normal"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <TopAppBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onLocateUser={handleLocateUser}
        savedCount={savedStops.length}
      />

      {/* Main Content Layout Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-4 sm:py-6 space-y-6">
        {currentTab === 'routes' && (
          <>
            {/* Section 2: Search, Direction Selection, and Quick Filters */}
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSearchSubmit={handleSearchSubmit}
              onClearSearch={() => setSearchQuery('')}
              activeServiceNumber={activeServiceNumber}
              onSelectService={handleSelectService}
              activeDirection={activeDirection}
              onChangeDirection={setActiveDirection}
              currentService={currentService}
              showNearestStop={showNearestStop}
              onToggleNearestStop={() => {
                const nextVal = !showNearestStop;
                setShowNearestStop(nextVal);
                if (nextVal) {
                  setActiveStop(defaultStop);
                  showToast('Re-centered to nearest stop: Dhoby Ghaut Exit B');
                }
              }}
            />

            {/* Section 3: Nearest Stop Spotlight Card (Hero Unit) */}
            <NearestStopSpotlight
              stop={activeStop}
              serviceNumber={activeServiceNumber}
              predictions={predictions}
              secondsSinceUpdate={secondsSinceUpdate}
              onRefresh={handleManualRefresh}
              onOpenWalkGuide={() => setIsWalkGuideOpen(true)}
              onOpenRemind={() => setIsRemindOpen(true)}
              isSaved={isCurrentStopSaved}
              onToggleSaveStop={handleToggleSaveStop}
            />

            {/* Section 4: Two-Column Operational Transit Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Sequential Route Diagram & Real-Time Stepper (7 cols) */}
              <div className="lg:col-span-7">
                <RouteStepper
                  serviceNumber={activeServiceNumber}
                  stops={ROUTE_147_STOPS_DIR1}
                  activeStopCode={activeStop.code}
                  onSelectStop={handleSelectStop}
                  transponders={transponders}
                  totalStopsCount={currentService.totalStopsDir1}
                />
              </div>

              {/* Right Column: Interactive Map, Route Stats & Co-located Services (5 cols) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Live Transit Map Overview Box */}
                <GeoVectorMap
                  activeStop={activeStop}
                  transponders={transponders}
                  onOpenFullscreen={() => setIsFullscreenMapOpen(true)}
                  serviceNumber={activeServiceNumber}
                />

                {/* Route Operating Statistics Bento Card */}
                <OperatingProfile service={currentService} />

                {/* Co-located Services at this Stop */}
                <ColocatedBuses
                  stopCode={activeStop.code}
                  buses={colocatedBuses}
                  onSelectService={handleSelectService}
                />
              </div>
            </div>
          </>
        )}

        {currentTab === 'nearby' && (
          <NearbyView
            onSelectStop={handleSelectStop}
            onTrackService={handleSelectService}
          />
        )}

        {currentTab === 'alerts' && <AlertsView />}

        {currentTab === 'saved' && (
          <SavedView
            savedStops={savedStops}
            onSelectStop={handleSelectStop}
            onRemoveSavedStop={handleRemoveSavedStop}
            onSwitchToRoutes={() => setCurrentTab('routes')}
          />
        )}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <BottomNavBar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        savedCount={savedStops.length}
      />

      {/* Modals */}
      <WalkGuideModal
        isOpen={isWalkGuideOpen}
        onClose={() => setIsWalkGuideOpen(false)}
        stop={activeStop}
      />

      <RemindModal
        isOpen={isRemindOpen}
        onClose={() => setIsRemindOpen(false)}
        serviceNumber={activeServiceNumber}
        stop={activeStop}
        onSetReminder={handleSetReminder}
      />

      <FullscreenMapModal
        isOpen={isFullscreenMapOpen}
        onClose={() => setIsFullscreenMapOpen(false)}
        serviceNumber={activeServiceNumber}
        stops={ROUTE_147_STOPS_DIR1}
        activeStop={activeStop}
        onSelectStop={handleSelectStop}
        transponders={transponders}
      />
    </div>
  );
}
