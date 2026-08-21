import React, { useState } from 'react';
import { Contact, OrbitTier } from '../types';
import { Sparkles, Phone, MessageSquare, Heart, Clock, ChevronRight, User } from 'lucide-react';
import { getShameFreeStatus } from '../utils/storage';
import { sound } from '../utils/audio';

interface Props {
  contacts: Contact[];
  onSelectContact: (contact: Contact) => void;
  onOpenIcebreaker: (contact: Contact) => void;
  onOpenCallTimer: (contact: Contact) => void;
  onLogDone: (contactId: string) => void;
}

export const OrbitConstellation: React.FC<Props> = ({
  contacts,
  onSelectContact,
  onOpenIcebreaker,
  onOpenCallTimer,
  onLogDone,
}) => {
  const [selectedContact, setSelectedContact] = useState<Contact | null>(
    contacts.length > 0 ? contacts[0] : null
  );

  const activeContacts = contacts.filter((c) => !c.isQuiet);

  const handleNodeClick = (contact: Contact) => {
    setSelectedContact(contact);
    sound.playPop();
  };

  const getTierContacts = (tier: OrbitTier) => {
    return activeContacts.filter((c) => c.orbitTier === tier);
  };

  const innerCircle = getTierContacts('inner_circle');
  const warmOrbit = getTierContacts('warm_orbit');
  const seasonal = getTierContacts('seasonal');
  const annual = getTierContacts('annual');

  const selectedStatus = selectedContact ? getShameFreeStatus(selectedContact) : null;

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[36px] p-6 sm:p-8 shadow-2xl mb-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-white/10 mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.2)]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">
              Social Orbit & Constellation Map
            </h3>
            <p className="text-xs text-slate-400">
              Relationships visualized by gravitational closeness. Glowing rings = ready for connection.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block shadow-[0_0_8px_#34d399]" />
            <span>Warm in Orbit</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 inline-block shadow-[0_0_8px_#818cf8] animate-pulse" />
            <span>Spotlight Ready</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Visual Solar System Orbit Rings */}
        <div className="lg:col-span-7 relative flex items-center justify-center min-h-[360px] sm:min-h-[400px] p-4 overflow-hidden rounded-3xl bg-[#0A0A0C]/90 border border-white/10 shadow-inner">
          {/* Orbital Ambient Glow */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#312E81_0%,transparent_70%)] opacity-30 pointer-events-none" />

          {/* Orbital Rings */}
          <div className="absolute w-[100px] h-[100px] rounded-full border border-indigo-500/30 border-dashed pointer-events-none" />
          <div className="absolute w-[190px] h-[190px] rounded-full border border-indigo-500/20 pointer-events-none" />
          <div className="absolute w-[280px] h-[280px] rounded-full border border-indigo-500/15 border-dashed pointer-events-none" />
          <div className="absolute w-[350px] h-[350px] rounded-full border border-indigo-500/10 pointer-events-none" />

          {/* Central User Sun */}
          <div className="relative z-10 w-14 h-14 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white flex flex-col items-center justify-center font-bold text-[11px] shadow-[0_0_25px_rgba(99,102,241,0.6)] ring-4 ring-indigo-500/30">
            <span>YOU</span>
          </div>

          {/* Render Contacts dynamically along orbit rings */}
          {activeContacts.map((contact) => {
            const status = getShameFreeStatus(contact);
            // Calculate orbital radius by tier
            let radius = 80;
            if (contact.orbitTier === 'inner_circle') radius = 55;
            else if (contact.orbitTier === 'warm_orbit') radius = 100;
            else if (contact.orbitTier === 'seasonal') radius = 145;
            else radius = 175;

            // Distribute angles
            const tierContacts = getTierContacts(contact.orbitTier);
            const indexInTier = tierContacts.findIndex((c) => c.id === contact.id);
            const totalInTier = Math.max(1, tierContacts.length);
            const angleOffset = (contact.orbitTier === 'warm_orbit' ? 0.4 : 0.8) + (indexInTier / totalInTier) * 2 * Math.PI;

            const x = Math.cos(angleOffset) * radius;
            const y = Math.sin(angleOffset) * radius;

            const isSelected = selectedContact?.id === contact.id;

            return (
              <button
                key={contact.id}
                onClick={() => handleNodeClick(contact)}
                style={{
                  transform: `translate(${x}px, ${y}px)`,
                }}
                className={`absolute z-20 group transition-all duration-300 ${
                  isSelected ? 'scale-125 z-30' : 'hover:scale-110'
                }`}
              >
                <div className="relative flex flex-col items-center">
                  {/* Node Circle */}
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center text-xs font-bold transition-all border-2 border-[#0A0A0C] ${
                      contact.avatar ? 'overflow-hidden' : 'bg-gradient-to-b from-slate-700 to-slate-900 text-white'
                    } ${
                      isSelected
                        ? 'ring-3 ring-white shadow-[0_0_20px_rgba(255,255,255,0.7)]'
                        : status.isDue
                        ? 'ring-2 ring-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.6)] animate-pulse'
                        : 'ring-1 ring-emerald-400/80 shadow-[0_0_8px_rgba(52,211,153,0.4)]'
                    }`}
                  >
                    {contact.avatar ? (
                      <img
                        src={contact.avatar}
                        alt={contact.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      contact.name.charAt(0)
                    )}
                  </div>

                  {/* Name label beneath node */}
                  <span
                    className={`mt-1.5 text-[10px] font-semibold px-2 py-0.5 rounded-lg whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-white text-slate-950 font-bold shadow-lg'
                        : 'bg-slate-900/90 text-slate-300 border border-white/10 backdrop-blur-md'
                    }`}
                  >
                    {contact.name.split(' ')[0]}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Contact Inspector Card */}
        <div className="lg:col-span-5">
          {selectedContact && selectedStatus ? (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                  {selectedContact.avatar ? (
                    <img
                      src={selectedContact.avatar}
                      alt={selectedContact.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white/10 shadow-lg"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-bold text-white bg-gradient-to-b from-slate-700 to-slate-900 border border-white/10 shadow-lg`}
                    >
                      {selectedContact.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <h4 className="text-base font-bold text-white">{selectedContact.name}</h4>
                    <p className="text-xs text-slate-400">
                      {selectedContact.relationship} • {selectedContact.frequencyDays}d orbit
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onSelectContact(selectedContact)}
                  className="text-xs px-3 py-1.5 rounded-xl bg-white text-slate-900 font-bold hover:scale-[1.02] active:scale-95 transition-all shadow-md"
                >
                  Spotlight Card
                </button>
              </div>

              {/* Status banner */}
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl p-3 mb-3.5 text-xs flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                <span className="text-slate-200">{selectedStatus.statusMessage}</span>
              </div>

              {/* Scratchpad preview */}
              <div className="bg-white/5 rounded-2xl p-3.5 mb-4 border border-white/5 text-xs text-slate-300">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-1">
                  Context Notes
                </div>
                <p className="italic">"{selectedContact.notes || 'No saved notes.'}"</p>
              </div>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => onOpenCallTimer(selectedContact)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition-all border border-white/10 hover:scale-[1.02] active:scale-95"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Call Sprint</span>
                </button>

                <button
                  onClick={() => onOpenIcebreaker(selectedContact)}
                  className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 text-xs font-bold transition-all border border-indigo-500/30 hover:scale-[1.02] active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span>AI Icebreaker</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-xs text-slate-500">
              Click any star node to inspect relationship orbit.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
