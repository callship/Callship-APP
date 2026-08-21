import React, { useState, useEffect } from 'react';
import {
  Contact,
  OrbitTier,
  RelationshipType,
  VibeCategory,
} from '../types';
import {
  Search,
  Plus,
  Phone,
  MessageSquare,
  Sparkles,
  Edit2,
  Trash2,
  Clock,
  Heart,
  StickyNote,
  Sliders,
  Moon,
  Sun,
  UserCheck,
  CheckCircle2,
  UserPlus,
  RefreshCw,
  X,
  Crown,
  History,
} from 'lucide-react';
import { getShameFreeStatus, FREE_TIER_LIMIT } from '../utils/storage';
import { sound } from '../utils/audio';

interface Props {
  contacts: Contact[];
  isPro: boolean;
  onAddContact: (contact: Omit<Contact, 'id' | 'interactionHistory' | 'streak'>) => void;
  onUpdateContact: (contact: Contact) => void;
  onDeleteContact: (contactId: string) => void;
  onSelectForSpotlight: (contact: Contact) => void;
  onOpenIcebreaker: (contact: Contact) => void;
  onOpenCallTimer: (contact: Contact) => void;
  onOpenHistory: (contact: Contact) => void;
  onOpenProModal: () => void;
  onRestoreDefaults: () => void;
}

export const ContactDirectory: React.FC<Props> = ({
  contacts,
  isPro,
  onAddContact,
  onUpdateContact,
  onDeleteContact,
  onSelectForSpotlight,
  onOpenIcebreaker,
  onOpenCallTimer,
  onOpenHistory,
  onOpenProModal,
  onRestoreDefaults,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrbit, setSelectedOrbit] = useState<string>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  // New Contact Form State
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [relationship, setRelationship] = useState<RelationshipType>('Friend');
  const [vibeCategory, setVibeCategory] = useState<VibeCategory>('warm');
  const [orbitTier, setOrbitTier] = useState<OrbitTier>('warm_orbit');
  const [frequencyDays, setFrequencyDays] = useState<number>(30);
  const [notes, setNotes] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.relationship.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.notes.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;
    if (selectedOrbit === 'all') return true;
    if (selectedOrbit === 'quiet') return c.isQuiet;
    if (c.isQuiet) return false;
    return c.orbitTier === selectedOrbit;
  });

  const resetForm = () => {
    setName('');
    setPhone('');
    setRelationship('Friend');
    setVibeCategory('warm');
    setOrbitTier('warm_orbit');
    setFrequencyDays(30);
    setNotes('');
    setTagsInput('');
    setAvatarUrl('');
    setEditingContact(null);
  };

  // Body scroll locking for Add/Edit Contact Modal
  useEffect(() => {
    if (isAddModalOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [isAddModalOpen]);

  const handleOrbitChange = (tier: OrbitTier) => {
    setOrbitTier(tier);
    if (tier === 'inner_circle') setFrequencyDays(7);
    else if (tier === 'warm_orbit') setFrequencyDays(30);
    else if (tier === 'seasonal') setFrequencyDays(90);
    else if (tier === 'annual') setFrequencyDays(365);
  };

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    if (editingContact) {
      onUpdateContact({
        ...editingContact,
        name: name.trim(),
        phone: phone.trim() || undefined,
        relationship,
        vibeCategory,
        orbitTier,
        frequencyDays: Number(frequencyDays) || 30,
        notes: notes.trim(),
        tags,
        avatar: avatarUrl.trim() || editingContact.avatar,
        isQuiet: orbitTier === 'quiet',
      });
    } else {
      onAddContact({
        name: name.trim(),
        phone: phone.trim() || undefined,
        relationship,
        vibeCategory,
        orbitTier,
        frequencyDays: Number(frequencyDays) || 30,
        lastContactDate: new Date().toISOString(),
        notes: notes.trim(),
        tags,
        avatar: avatarUrl.trim() || undefined,
        isQuiet: orbitTier === 'quiet',
      });
    }

    sound.playSuccessChime();
    resetForm();
    setIsAddModalOpen(false);
  };

  const startEdit = (c: Contact) => {
    setEditingContact(c);
    setName(c.name);
    setPhone(c.phone || '');
    setRelationship(c.relationship);
    setVibeCategory(c.vibeCategory);
    setOrbitTier(c.orbitTier);
    setFrequencyDays(c.frequencyDays);
    setNotes(c.notes || '');
    setTagsInput(c.tags ? c.tags.join(', ') : '');
    setAvatarUrl(c.avatar || '');
    setIsAddModalOpen(true);
  };

  return (
    <div className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-[36px] p-6 sm:p-8 shadow-2xl">
      {/* Header with Search and Add buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <h3 className="text-xl font-bold text-white uppercase tracking-wider">
              Social Circle Directory
            </h3>
            {isPro ? (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Crown className="w-3 h-3" /> Pro Active
              </span>
            ) : (
              <button
                onClick={onOpenProModal}
                className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 transition-colors flex items-center gap-1"
              >
                <span>Free Tier ({contacts.length}/{FREE_TIER_LIMIT})</span>
                <span className="text-amber-400 font-bold">• Upgrade</span>
              </button>
            )}
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage your relationships, calibrate reminder intervals, and keep scratchpad memory notes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={() => {
              if (!isPro && contacts.length >= FREE_TIER_LIMIT) {
                onOpenProModal();
                return;
              }
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white text-slate-950 font-bold text-xs shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-indigo-600" />
            <span>Add Person</span>
          </button>

          <button
            onClick={onRestoreDefaults}
            title="Reset to sample contacts"
            className="p-2.5 rounded-xl text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Search & Orbit Filter Pills */}
      <div className="space-y-3.5 mb-6">
        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, relationship, tags, or memory notes..."
            className="w-full text-xs pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-100 placeholder:text-slate-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Orbit Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {[
            { id: 'all', label: `All Circle (${contacts.length})` },
            { id: 'inner_circle', label: 'Inner Circle (7d)' },
            { id: 'warm_orbit', label: 'Warm Orbit (30d)' },
            { id: 'seasonal', label: 'Seasonal (90d)' },
            { id: 'annual', label: 'Annual (365d)' },
            { id: 'quiet', label: 'Quiet Orbit' },
          ].map((pill) => (
            <button
              key={pill.id}
              onClick={() => {
                setSelectedOrbit(pill.id);
                sound.playPop();
              }}
              className={`px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-all border ${
                selectedOrbit === pill.id
                  ? 'bg-white text-slate-950 border-white shadow-lg'
                  : 'bg-white/5 text-slate-400 border-white/5 hover:bg-white/10 hover:text-slate-200'
              }`}
            >
              {pill.label}
            </button>
          ))}
        </div>
      </div>

      {/* Contact Cards List */}
      <div className="space-y-3">
        {filteredContacts.length > 0 ? (
          filteredContacts.map((contact) => {
            const status = getShameFreeStatus(contact);
            return (
              <div
                key={contact.id}
                className="group bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 rounded-2xl p-4 sm:p-5 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                {/* Left profile info */}
                <div className="flex items-start gap-3.5 flex-1 min-w-0">
                  {contact.avatar ? (
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      referrerPolicy="no-referrer"
                      className="w-12 h-12 rounded-2xl object-cover border-2 border-white/10 shadow-lg shrink-0"
                    />
                  ) : (
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-bold text-white shrink-0 bg-gradient-to-b from-slate-700 to-slate-900 border border-white/10 shadow-lg`}
                    >
                      {contact.name.charAt(0)}
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className="text-sm font-bold text-white truncate">
                        {contact.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-slate-300 font-semibold border border-white/10">
                        {contact.relationship}
                      </span>
                      {contact.isQuiet && (
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-white/5">
                          Quiet Orbit
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-1 italic mb-2">
                      "{contact.notes || 'No notes added yet.'}"
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-slate-400 flex-wrap">
                      <span className="flex items-center gap-1 font-semibold text-indigo-400">
                        <Clock className="w-3 h-3" />
                        Every {contact.frequencyDays} days
                      </span>
                      <span>•</span>
                      <span>Last: {status.daysSince}d ago</span>
                      <span>•</span>
                      <span className="text-slate-300 font-medium">
                        {status.statusBadge}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex items-center gap-2 w-full sm:w-auto justify-end pt-3 sm:pt-0 border-t sm:border-t-0 border-white/5">
                  <button
                    onClick={() => onSelectForSpotlight(contact)}
                    className="py-2 px-3 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/30 text-xs font-bold transition-all hover:scale-[1.02] active:scale-95"
                  >
                    Focus Card
                  </button>

                  <button
                    onClick={() => onOpenHistory(contact)}
                    title="View Timeline & Memories"
                    className="p-2 rounded-xl text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
                  >
                    <History className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenCallTimer(contact)}
                    title="Start Call Sprint"
                    className="p-2 rounded-xl text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onOpenIcebreaker(contact)}
                    title="Generate AI Icebreaker"
                    className="p-2 rounded-xl text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors"
                  >
                    <Sparkles className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => startEdit(contact)}
                    title="Edit Contact & Orbit"
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => onDeleteContact(contact.id)}
                    title="Delete"
                    className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-3xl">
            <p className="text-sm text-slate-400 mb-3">No contacts found matching this filter.</p>
            <button
              onClick={() => {
                resetForm();
                setIsAddModalOpen(true);
              }}
              className="text-xs text-indigo-400 font-bold hover:underline"
            >
              + Add a person to your circle
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Contact Modal */}
      {isAddModalOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAddModalOpen(false);
              resetForm();
            }
          }}
          className="fixed inset-0 z-50 overflow-y-auto overscroll-contain flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0C]/85 backdrop-blur-md animate-in fade-in duration-150"
        >
          <div className="bg-[#0A0A0C] border border-white/10 rounded-[32px] max-w-lg w-full p-6 sm:p-7 shadow-2xl overflow-y-auto overscroll-contain max-h-[90vh] text-slate-100 relative my-auto">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5 shrink-0">
              <h3 className="text-base font-bold text-white uppercase tracking-wider">
                {editingContact ? 'Edit Contact & Orbit' : 'Add Person to Orbit'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  resetForm();
                }}
                aria-label="Close modal"
                className="p-1 rounded-full text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveContact} className="space-y-4 text-xs">
              {/* Name & Phone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Maya Chen"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Relationship & Vibe Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Relationship
                  </label>
                  <select
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value as RelationshipType)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="Family">Family</option>
                    <option value="Best Friend">Best Friend</option>
                    <option value="Close Friend">Close Friend</option>
                    <option value="Friend">Friend</option>
                    <option value="Colleague">Colleague</option>
                    <option value="Mentor">Mentor</option>
                    <option value="Network">Network</option>
                    <option value="Acquaintance">Acquaintance</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Vibe (ADHD Energy Filter)
                  </label>
                  <select
                    value={vibeCategory}
                    onChange={(e) => setVibeCategory(e.target.value as VibeCategory)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  >
                    <option value="low_energy">Low Energy (Safe / Zero-judgment)</option>
                    <option value="warm">Warm Friend</option>
                    <option value="deep_roots">Deep Roots (Family / Lifelong)</option>
                    <option value="high_stakes">High Stakes (Growth / Mentor)</option>
                  </select>
                </div>
              </div>

              {/* Orbit Tier Preset */}
              <div>
                <label className="block font-semibold text-slate-300 mb-2">
                  Orbit Tier (Remind Frequency)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {[
                    { id: 'inner_circle', label: 'Inner Circle', sub: 'Every 7d' },
                    { id: 'warm_orbit', label: 'Warm Orbit', sub: 'Every 30d' },
                    { id: 'seasonal', label: 'Seasonal', sub: 'Every 90d' },
                    { id: 'annual', label: 'Annual Orbit', sub: 'Every 365d' },
                  ].map((o) => (
                    <button
                      type="button"
                      key={o.id}
                      onClick={() => handleOrbitChange(o.id as OrbitTier)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        orbitTier === o.id
                          ? 'bg-white text-slate-950 border-white shadow-lg'
                          : 'bg-white/5 text-slate-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="font-bold text-[11px]">{o.label}</div>
                      <div className={`text-[10px] ${orbitTier === o.id ? 'text-indigo-600 font-semibold' : 'text-slate-400'}`}>
                        {o.sub}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Frequency Slider */}
              <div className="bg-white/5 p-3 rounded-2xl border border-white/5">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="font-semibold text-slate-300">
                    Exact Frequency Interval:
                  </label>
                  <span className="font-bold text-indigo-400">
                    Every {frequencyDays} days
                  </span>
                </div>
                <input
                  type="range"
                  min="3"
                  max="365"
                  step="1"
                  value={frequencyDays}
                  onChange={(e) => setFrequencyDays(Number(e.target.value))}
                  className="w-full accent-indigo-500"
                />
              </div>

              {/* Scratchpad Context Note */}
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Memory Scratchpad Notes (What you talked about / key life updates)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Loves gardening, bought a puppy named Luna, birthday in October..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-500"
                />
              </div>

              {/* Tags & Avatar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Tags (Comma separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. College, Design, Bestie"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Photo URL (Optional)
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-white text-slate-950 font-bold shadow-lg hover:scale-[1.02] active:scale-95 transition-all"
                >
                  {editingContact ? 'Save Changes' : 'Add to Orbit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
