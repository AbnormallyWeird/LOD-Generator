import { useState, useEffect, useRef } from 'react';
import { Users, UserPlus, X, Copy, Trophy, RefreshCw } from 'lucide-react';
import './index.css'; // Just using index.css for everything

function App() {
  const [players, setPlayers] = useState(() => {
    const saved = localStorage.getItem('players');
    return saved ? JSON.parse(saved) : [];
  });
  const [playerName, setPlayerName] = useState('');
  const [playersPerTeam, setPlayersPerTeam] = useState(2);
  const [teams, setTeams] = useState([]);
  const [signupCost, setSignupCost] = useState(20);
  const [copySuccess, setCopySuccess] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationKey, setGenerationKey] = useState(0);
  const teamsRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('players', JSON.stringify(players));
  }, [players]);

  const addPlayer = (e) => {
    e?.preventDefault();
    const name = playerName.trim();
    if (name && !players.includes(name)) {
      setPlayers([...players, name]);
      setPlayerName('');
    } else if (players.includes(name)) {
      alert('This player has already been added!');
    }
  };

  const removePlayer = (index) => {
    setPlayers(players.filter((_, i) => i !== index));
    setTeams([]);
  };

  const clearPlayers = () => {
    if (confirm('Are you sure you want to remove all players?')) {
      setPlayers([]);
      setTeams([]);
    }
  };

  const generateTeams = () => {
    if (players.length < 2) {
      alert('You need at least 2 players to generate teams!');
      return;
    }
    if (players.length < playersPerTeam) {
      alert(`You need at least ${playersPerTeam} players to make teams of ${playersPerTeam}!`);
      return;
    }

    setIsGenerating(true);

    setTimeout(() => {
      const shuffledPlayers = [...players];
      for (let i = shuffledPlayers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledPlayers[i], shuffledPlayers[j]] = [shuffledPlayers[j], shuffledPlayers[i]];
      }

      const newTeams = [];
      for (let i = 0; i < shuffledPlayers.length; i += playersPerTeam) {
        newTeams.push(shuffledPlayers.slice(i, i + playersPerTeam));
      }

      if (newTeams.length > 1 && newTeams[newTeams.length - 1].length < playersPerTeam) {
        const lastTeam = newTeams.pop();
        lastTeam.forEach((player, i) => {
          newTeams[i % newTeams.length].push(player);
        });
      }

      setTeams(newTeams);
      setGenerationKey(prev => prev + 1);
      setIsGenerating(false);
    }, 600); // Small delay to show the animation
  };

  useEffect(() => {
    if (teams.length > 0 && teamsRef.current) {
      setTimeout(() => {
        teamsRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [generationKey]);

  const copyTeamsToClipboard = () => {
    if (teams.length === 0) return;
    const formattedTeams = teams.map((team) => team.join(' & ')).join('\n');
    navigator.clipboard.writeText(formattedTeams).then(() => {
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    });
  };

  const calculatePayouts = () => {
    const numPlayers = players.length;
    if (signupCost <= 0 || numPlayers < 6 || teams.length === 0) {
      return null;
    }

    const prizePool = signupCost * numPlayers;
    const thirdPlace = Math.floor(signupCost);
    let firstPlace = Math.floor(prizePool * 0.55);
    let secondPlace = prizePool - firstPlace - thirdPlace;

    const secondPlaceRounded = Math.floor(secondPlace);
    const remainder = secondPlace - secondPlaceRounded;
    firstPlace += Math.floor(remainder);
    secondPlace = secondPlaceRounded;

    if (secondPlace <= thirdPlace) {
      const diff = thirdPlace - secondPlace + 5;
      secondPlace += diff;
      firstPlace = Math.max(firstPlace - diff, thirdPlace + 10);
    }

    const p1 = parseFloat((firstPlace / prizePool * 100).toFixed(1));
    const p2 = parseFloat((secondPlace / prizePool * 100).toFixed(1));
    const p3 = (100 - p1 - p2).toFixed(1);

    return [
      { place: '1st Place', amount: firstPlace, percentage: p1.toFixed(1) },
      { place: '2nd Place', amount: secondPlace, percentage: p2.toFixed(1) },
      { place: '3rd Place', amount: thirdPlace, percentage: p3 },
    ];
  };

  const payouts = calculatePayouts();

  return (
    <div className="app-container">
      <div className="header">
        <h1 className="text-gradient">LOD Team Randomizer</h1>
        <p>Premium Dart Tournament Partner Matching</p>
      </div>

      <div className="grid-layout">
        {/* Left Column: Players */}
        <div className="glass-panel">
          <div className="flex-between mb-4">
            <h2 className="flex-center gap-2"><Users size={24} className="text-gradient" /> Players ({players.length})</h2>
            {players.length > 0 && (
              <button onClick={clearPlayers} className="glass-button danger" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
                Clear All
              </button>
            )}
          </div>
          
          <form onSubmit={addPlayer} className="flex-center gap-2 mb-4">
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              placeholder="Enter player name..."
              className="glass-input"
            />
            <button type="submit" className="glass-button">
              <UserPlus size={20} /> Add
            </button>
          </form>

          <ul className="player-list">
            {players.map((player, index) => (
              <li key={index} className="player-item list-item-enter" style={{ animationDelay: `${index * 0.05}s` }}>
                <span>{player}</span>
                <button onClick={() => removePlayer(index)} className="icon-btn" aria-label="Remove player">
                  <X size={18} />
                </button>
              </li>
            ))}
            {players.length === 0 && (
              <div className="text-center text-secondary mt-8" style={{ color: 'var(--text-secondary)' }}>
                No players added yet.
              </div>
            )}
          </ul>
        </div>

        {/* Right Column: Generation & Payouts */}
        <div className="flex-col gap-4">
          <div className="glass-panel mb-4">
            <h2 className="flex-center gap-2 mb-4"><RefreshCw size={24} className="text-gradient" /> Generator Settings</h2>
            
            <div className="mb-4">
              <label className="text-secondary mb-2" style={{ display: 'block' }}>Players per team:</label>
              <select 
                value={playersPerTeam} 
                onChange={(e) => setPlayersPerTeam(Number(e.target.value))}
                className="glass-select"
              >
                <option value={2}>2 (Doubles)</option>
                <option value={3}>3 (Triples)</option>
                <option value={4}>4 (Quads)</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="text-secondary mb-2" style={{ display: 'block' }}>Signup Cost per Person ($):</label>
              <input 
                type="number" 
                value={signupCost} 
                onChange={(e) => setSignupCost(Number(e.target.value))}
                min="0"
                step="1"
                className="glass-input"
              />
            </div>

            <button onClick={generateTeams} className="glass-button success w-full" disabled={isGenerating}>
              {isGenerating ? (
                <><RefreshCw size={20} className="animate-spin" /> Randomizing Teams...</>
              ) : (
                'Generate Random Teams'
              )}
            </button>
          </div>

          {payouts && (
            <div className="glass-panel animate-fade-in">
              <h2 className="flex-center gap-2 mb-4"><Trophy size={24} className="text-gradient" /> Prize Payouts</h2>
              <div className="flex-between mb-4 text-secondary">
                <span>Total Teams: <strong>{teams.length}</strong></span>
                <span>Prize Pool: <strong className="text-gradient">${signupCost * players.length}</strong></span>
              </div>
              
              <div className="payout-card first">
                <div>
                  <div style={{ fontWeight: 600 }}>{payouts[0].place}</div>
                  <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{payouts[0].percentage}%</div>
                </div>
                <div className="payout-amount">${payouts[0].amount}</div>
              </div>
              
              <div className="payout-card second">
                <div>
                  <div style={{ fontWeight: 600 }}>{payouts[1].place}</div>
                  <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{payouts[1].percentage}%</div>
                </div>
                <div className="payout-amount" style={{ color: '#94a3b8' }}>${payouts[1].amount}</div>
              </div>
              
              <div className="payout-card third">
                <div>
                  <div style={{ fontWeight: 600 }}>{payouts[2].place}</div>
                  <div className="text-secondary" style={{ fontSize: '0.85rem' }}>{payouts[2].percentage}%</div>
                </div>
                <div className="payout-amount" style={{ color: '#b45309' }}>${payouts[2].amount}</div>
              </div>

              <div className="flex-between mt-4 pt-3 text-secondary" style={{ borderTop: '1px solid var(--card-border)' }}>
                <span style={{ fontWeight: 600 }}>Total Payout:</span>
                <div style={{ textAlign: 'right' }}>
                  <span className="text-gradient" style={{ fontWeight: 700, fontSize: '1.2rem', marginRight: '8px' }}>
                    ${payouts.reduce((s, p) => s + p.amount, 0)}
                  </span>
                  <span style={{ fontSize: '0.9rem' }}>
                    ({payouts.reduce((s, p) => s + parseFloat(p.percentage), 0).toFixed(0)}%)
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {teams.length > 0 && (
        <div ref={teamsRef} key={generationKey} className="glass-panel mt-4 animate-fade-in">
          <div className="flex-between mb-4">
            <h2 className="flex-center gap-2"><Users size={24} className="text-gradient" /> Generated Teams</h2>
            <button onClick={copyTeamsToClipboard} className="glass-button outline" style={{ padding: '6px 12px', fontSize: '0.9rem' }}>
              <Copy size={16} /> {copySuccess ? 'Copied!' : 'Copy to Clipboard'}
            </button>
          </div>
          
          <div className="teams-grid">
            {teams.map((team, index) => (
              <div key={index} className="team-card list-item-enter" style={{ animationDelay: `${index * 0.05}s` }}>
                <div className="team-header">Team {index + 1}</div>
                <div>
                  {team.map((player, pIndex) => (
                    <div key={pIndex} className="team-member">
                      <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--text-secondary)' }}></div>
                      {player}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
