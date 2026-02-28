import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Trophy, Medal, Target, TrendingUp, Users, Loader2 } from 'lucide-react';
import {
    fetchStatsRequest,
    fetchLeaderboardRequest,
    fetchAchievementsRequest
} from '../../store/slices/achievementsSlice';

const AchievementHub = () => {
    const dispatch = useDispatch();
    const { items, stats, leaderboard, loading } = useSelector(state => state.achievements);

    useEffect(() => {
        dispatch(fetchStatsRequest());
        dispatch(fetchLeaderboardRequest());
        dispatch(fetchAchievementsRequest());
    }, [dispatch]);

    if (loading && items.length === 0) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                <Loader2 className="animate-spin" size={32} color="var(--primary-color)" />
            </div>
        );
    }

    return (
        <div className="achievement-hub" style={{ color: 'white', padding: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '30px' }}>

                <div className="stat-card" style={statCardStyle}>
                    <TrendingUp size={20} color="#34d399" />
                    <div>
                        <div style={labelStyle}>Current Streak</div>
                        <div style={valueStyle}>{stats.streak} Days</div>
                    </div>
                </div>

                <div className="stat-card" style={statCardStyle}>
                    <Target size={20} color="#8b5cf6" />
                    <div>
                        <div style={labelStyle}>User Level</div>
                        <div style={valueStyle}>Level {stats.level}</div>
                    </div>
                </div>

                <div className="stat-card" style={statCardStyle}>
                    <Trophy size={20} color="#fbbf24" />
                    <div>
                        <div style={labelStyle}>Achievements</div>
                        <div style={valueStyle}>{items.length} Unlocked</div>
                    </div>
                </div>

            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>

                <section>
                    <h3 style={sectionTitleStyle}>
                        <Medal size={18} /> Your Achievements
                    </h3>

                    <div style={listContainerStyle}>
                        {items.length > 0 ? items.map(achievement => (
                            <div key={achievement.id} style={itemStyle}>
                                <div style={iconContainerStyle}>🏆</div>
                                <div>
                                    <div style={{ fontWeight: 600 }}>
                                        {achievement.name}
                                    </div>

                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                        {achievement.description}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                You haven't unlocked any achievements yet.
                            </p>
                        )}
                    </div>

                </section>

                <section>

                    <h3 style={sectionTitleStyle}>
                        <Users size={18} /> Global Ranking
                    </h3>

                    <div style={listContainerStyle}>
                        {leaderboard.map((user, index) => (
                            <div
                                key={user.id}
                                style={{
                                    ...itemStyle,
                                    borderLeft: index < 3
                                        ? '4px solid #fbbf24'
                                        : 'none'
                                }}
                            >

                                <span style={{ fontWeight: 700, minWidth: '24px' }}>
                                    #{index + 1}
                                </span>

                                <div style={{ flex: 1, marginLeft: '10px' }}>
                                    {user.username}
                                </div>

                                <div style={{ fontWeight: 600, color: 'var(--primary-color)' }}>
                                    Lvl {user.level}
                                </div>

                            </div>
                        ))}
                    </div>

                </section>

            </div>
        </div>
    );
};

const statCardStyle = {
    background: 'rgba(255,255,255,0.05)',
    padding: '16px',
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
};

const labelStyle = {
    fontSize: '0.75rem',
    color: 'var(--text-muted)',
    textTransform: 'uppercase'
};

const valueStyle = {
    fontSize: '1.2rem',
    fontWeight: 700
};

const sectionTitleStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '16px',
    fontSize: '1.1rem'
};

const listContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
};

const itemStyle = {
    background: 'rgba(255,255,255,0.03)',
    padding: '12px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
};

const iconContainerStyle = {
    width: '40px',
    height: '40px',
    background: 'rgba(139, 92, 246, 0.2)',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
};

export default AchievementHub;