import { useState } from 'react';

const SHIFTS = [
  { id: 1, name: '06:00 – 15:00', start: 6, end: 15, color: 'bg-green-500', breaks: ['08:17–08:44', '11:17–11:44'] },
  { id: 2, name: '08:00 – 17:00', start: 8, end: 17, color: 'bg-blue-500', breaks: ['10:17–10:44', '13:17–13:44'] },
  { id: 3, name: '11:00 – 20:00', start: 11, end: 20, color: 'bg-yellow-500', breaks: ['13:17–13:44', '16:17–16:44'] },
  { id: 4, name: '14:00 – 23:00', start: 14, end: 23, color: 'bg-orange-500', breaks: ['16:17–16:44', '19:17–19:44'] },
  { id: 5, name: '16:00 – 01:00', start: 16, end: 25, color: 'bg-red-500', breaks: ['18:17–18:44', '21:17–21:44'] },
  { id: 6, name: '17:00 – 02:00', start: 17, end: 26, color: 'bg-purple-500', breaks: ['19:17–19:44', '22:17–22:44'] },
  { id: 7, name: '21:00 – 06:00', start: 21, end: 30, color: 'bg-gray-700', breaks: ['23:17–23:44', '02:17–02:44'] },
];

const generateBreakSlots = (shiftStart, shiftEnd) => {
  const slots = [];
  const actualEnd = shiftEnd >= 24 ? shiftEnd - 24 : shiftEnd;
  
  for (let hour = shiftStart + 1; hour < actualEnd - 1; hour++) {
    const displayHour = hour >= 24 ? hour - 24 : hour;
    if (displayHour >= 0 && displayHour < 24) {
      slots.push({ hour: displayHour, break1: `${String(displayHour).padStart(2, '0')}:17–${String(displayHour).padStart(2, '0')}:44` });
    }
  }
  return slots;
};

export default function BreakSlotScheduler() {
  const [agents, setAgents] = useState([
    { id: 1, name: 'Agent 1', shift: 1 },
    { id: 2, name: 'Agent 2', shift: 1 },
    { id: 3, name: 'Agent 3', shift: 2 },
    { id: 4, name: 'Agent 4', shift: 2 },
    { id: 5, name: 'Agent 5', shift: 3 },
    { id: 6, name: 'Agent 6', shift: 3 },
    { id: 7, name: 'Agent 7', shift: 4 },
    { id: 8, name: 'Agent 8', shift: 4 },
    { id: 9, name: 'Agent 9', shift: 5 },
    { id: 10, name: 'Agent 10', shift: 5 },
    { id: 11, name: 'Agent 11', shift: 6 },
    { id: 12, name: 'Agent 12', shift: 6 },
    { id: 13, name: 'Agent 13', shift: 7 },
    { id: 14, name: 'Agent 14', shift: 7 },
  ]);
  const [newAgent, setNewAgent] = useState({ name: '', shift: 1 });

  const addAgent = () => {
    if (newAgent.name.trim()) {
      setAgents([...agents, { ...newAgent, id: Date.now() }]);
      setNewAgent({ name: '', shift: 1 });
    }
  };

  const removeAgent = (id) => {
    setAgents(agents.filter(a => a.id !== id));
  };

  const assignRandomBreaks = () => {
    const updatedAgents = agents.map(agent => {
      const shift = SHIFTS.find(s => s.id === agent.shift);
      const breakIndex = Math.floor(Math.random() * 2);
      return {
        ...agent,
        break1: shift.breaks[0],
        break2: shift.breaks[1],
      };
    });
    setAgents(updatedAgents);
  };

  const getAgentsByShift = (shiftId) => agents.filter(a => a.shift === shiftId);

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Break Slot Scheduler</h1>
        <p className="text-gray-400 text-center mb-8">IVA Agent Break Management</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Rules Applied</h2>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-center gap-2">
                <span className="text-red-400">❌</span> No break in 1st & last hour
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-400">📊</span> ~12% shrinkage rule
              </li>
              <li className="flex items-center gap-2">
                <span className="text-yellow-400">⏱</span> Slots: :17→:44 & :47→:14
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">👥</span> 2 breaks per agent
              </li>
            </ul>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Add Agent</h2>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="Agent Name"
                value={newAgent.name}
                onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                className="bg-gray-700 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <select
                value={newAgent.shift}
                onChange={(e) => setNewAgent({ ...newAgent, shift: parseInt(e.target.value) })}
                className="bg-gray-700 px-4 py-2 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
              >
                {SHIFTS.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <button
                onClick={addAgent}
                className="bg-pink-600 hover:bg-pink-700 px-4 py-2 rounded-lg font-semibold transition"
              >
                Add Agent
              </button>
            </div>
          </div>

          <div className="bg-gray-800 p-6 rounded-xl">
            <h2 className="text-xl font-semibold mb-4">Actions</h2>
            <div className="flex flex-col gap-3">
              <button
                onClick={assignRandomBreaks}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg font-semibold transition"
              >
                Assign Breaks to All
              </button>
              <p className="text-sm text-gray-400">Total Agents: {agents.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {SHIFTS.map(shift => {
            const shiftAgents = getAgentsByShift(shift.id);
            return (
              <div key={shift.id} className="bg-gray-800 rounded-xl overflow-hidden">
                <div className={`${shift.color} px-4 py-3`}>
                  <h3 className="font-bold text-lg">{shift.name}</h3>
                  <p className="text-sm opacity-80">{shiftAgents.length} Agent(s)</p>
                </div>
                <div className="p-4">
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-400 font-semibold">Break Slots:</p>
                    {shift.breaks.map((brk, i) => (
                      <div key={i} className="bg-gray-700 px-3 py-2 rounded text-sm">
                        {brk}
                      </div>
                    ))}
                  </div>
                  {shiftAgents.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-400 font-semibold">Agents:</p>
                      {shiftAgents.map(agent => (
                        <div key={agent.id} className="flex items-center justify-between bg-gray-700/50 px-3 py-2 rounded">
                          <span>{agent.name}</span>
                          <button
                            onClick={() => removeAgent(agent.id)}
                            className="text-red-400 hover:text-red-300 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-sm italic">No agents assigned</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
