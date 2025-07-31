// Depth Enhancement: Core Game Mechanics System
// Enhanced mechanics for The Grid with progression, resources, and strategic depth

class GridGameEngine {
    constructor() {
        this.gameState = {
            // Player progression
            player: {
                level: 1,
                experience: 0,
                experienceToNext: 100,
                credits: 100,
                energy: 100,
                maxEnergy: 100,
                reputation: 0,
                skills: {
                    hacking: 1,
                    stealth: 1,
                    analytics: 1,
                    combat: 1
                },
                equipment: {
                    scanner: 'basic',
                    firewall: 'basic',
                    intrusion: 'basic'
                },
                achievements: []
            },
            
            // Grid system
            grid: {
                size: 8,
                cells: [],
                playerPosition: { x: 3, y: 3 },
                visibleRange: 2,
                exploredCells: new Set()
            },
            
            // Enhanced node system
            discoveredNodes: new Map(),
            connectedNode: null,
            activeConnections: [],
            networkSecurity: 'normal',
            
            // Game progression
            missions: [],
            currentMission: null,
            unlockedAreas: ['SECTOR_ALPHA'],
            
            // Time and events
            gameTime: 0,
            lastScanTime: 0,
            alertLevel: 0,
            
            // Combos and chains
            currentCombo: 0,
            comboMultiplier: 1,
            lastAction: null,
            actionChain: []
        };
        
        this.initializeGrid();
        this.loadNodeTemplates();
        this.initializeMissions();
    }

    // Depth Enhancement: Dynamic Grid System
    initializeGrid() {
        const { grid } = this.gameState;
        grid.cells = [];
        
        for (let y = 0; y < grid.size; y++) {
            grid.cells[y] = [];
            for (let x = 0; x < grid.size; x++) {
                grid.cells[y][x] = {
                    type: this.generateCellType(x, y),
                    discovered: false,
                    secured: false,
                    data: null,
                    effects: [],
                    connections: []
                };
            }
        }
        
        // Mark starting position as discovered
        const { x, y } = grid.playerPosition;
        grid.cells[y][x].discovered = true;
        grid.exploredCells.add(`${x},${y}`);
    }

    generateCellType(x, y) {
        const distance = Math.abs(x - 3) + Math.abs(y - 3);
        const random = Math.random();
        
        if (x === 3 && y === 3) return 'home';
        
        if (distance === 1) {
            return random < 0.7 ? 'data_node' : 'security_node';
        } else if (distance <= 3) {
            if (random < 0.3) return 'data_node';
            if (random < 0.5) return 'security_node';
            if (random < 0.7) return 'resource_node';
            if (random < 0.85) return 'trap_node';
            return 'mystery_node';
        } else {
            if (random < 0.2) return 'fortress_node';
            if (random < 0.4) return 'vault_node';
            if (random < 0.6) return 'server_farm';
            return 'empty';
        }
    }

    // Depth Enhancement: Advanced Node System
    loadNodeTemplates() {
        this.nodeTemplates = {
            data_node: {
                name: 'Data Repository',
                security: 'low',
                rewards: { credits: 25, experience: 15 },
                risks: { alertIncrease: 5 },
                hackDifficulty: 2,
                description: 'A standard data storage node containing various information packets.'
            },
            security_node: {
                name: 'Security Terminal',
                security: 'medium',
                rewards: { credits: 50, experience: 30, reputation: 5 },
                risks: { alertIncrease: 15, energyCost: 20 },
                hackDifficulty: 4,
                description: 'A security monitoring station. High risk, high reward.'
            },
            resource_node: {
                name: 'Resource Cache',
                security: 'low',
                rewards: { energy: 30, credits: 15 },
                risks: { alertIncrease: 2 },
                hackDifficulty: 1,
                description: 'Emergency resource stockpile for network maintenance.'
            },
            trap_node: {
                name: 'Honeypot System',
                security: 'high',
                rewards: { experience: 50 },
                risks: { alertIncrease: 30, energyCost: 40 },
                hackDifficulty: 6,
                description: 'A deceptive system designed to catch intruders.'
            },
            fortress_node: {
                name: 'Data Fortress',
                security: 'maximum',
                rewards: { credits: 200, experience: 100, reputation: 20 },
                risks: { alertIncrease: 50, energyCost: 60 },
                hackDifficulty: 8,
                description: 'Heavily fortified data center with valuable assets.'
            }
        };
    }

    // Depth Enhancement: Mission System
    initializeMissions() {
        this.missionTemplates = [
            {
                id: 'tutorial_scan',
                title: 'First Contact',
                description: 'Scan the local network to identify available nodes.',
                objectives: ['Perform your first network scan'],
                rewards: { experience: 25, credits: 50 },
                type: 'tutorial'
            },
            {
                id: 'data_collection',
                title: 'Information Gathering',
                description: 'Collect data from 3 different nodes to build network intelligence.',
                objectives: ['Access 3 data nodes', 'Maintain stealth below 50%'],
                rewards: { experience: 75, credits: 150, reputation: 10 },
                type: 'collection'
            },
            {
                id: 'security_breach',
                title: 'System Infiltration',
                description: 'Breach a high-security node without triggering alarms.',
                objectives: ['Hack a security node', 'Keep alert level under 25'],
                rewards: { experience: 150, credits: 300, equipment: 'advanced_scanner' },
                type: 'infiltration'
            }
        ];
        
        this.gameState.missions = [...this.missionTemplates];
        this.gameState.currentMission = this.gameState.missions[0];
    }

    // Depth Enhancement: Combo System
    processAction(action, success = true) {
        const { actionChain, currentCombo } = this.gameState;
        
        if (success) {
            // Build combo chain
            if (actionChain.length > 0 && this.isChainableAction(action, actionChain[actionChain.length - 1])) {
                this.gameState.currentCombo++;
                this.gameState.comboMultiplier = Math.min(3.0, 1 + (this.gameState.currentCombo * 0.2));
            } else {
                this.gameState.currentCombo = 1;
                this.gameState.comboMultiplier = 1;
            }
            
            actionChain.push({
                action: action,
                timestamp: Date.now(),
                success: true
            });
            
            // Limit chain history
            if (actionChain.length > 10) {
                actionChain.shift();
            }
        } else {
            // Failed action breaks combo
            this.gameState.currentCombo = 0;
            this.gameState.comboMultiplier = 1;
        }
        
        this.gameState.lastAction = action;
        return this.gameState.comboMultiplier;
    }

    isChainableAction(current, previous) {
        const chains = {
            'scan': ['move', 'hack'],
            'hack': ['scan', 'stealth'],
            'stealth': ['move', 'hack'],
            'move': ['scan', 'stealth']
        };
        
        return chains[current]?.includes(previous.action);
    }

    // Depth Enhancement: Resource Management
    consumeEnergy(amount) {
        if (this.gameState.player.energy >= amount) {
            this.gameState.player.energy -= amount;
            return true;
        }
        return false;
    }

    regenerateEnergy(amount = 5) {
        this.gameState.player.energy = Math.min(
            this.gameState.player.maxEnergy,
            this.gameState.player.energy + amount
        );
    }

    // Depth Enhancement: Skill System
    gainExperience(amount, skill = null) {
        const multiplier = this.gameState.comboMultiplier;
        const totalExp = Math.floor(amount * multiplier);
        
        this.gameState.player.experience += totalExp;
        
        if (skill && this.gameState.player.skills[skill]) {
            // Skill-specific experience (simplified)
            const skillBonus = Math.floor(totalExp * 0.3);
            this.checkSkillLevelUp(skill, skillBonus);
        }
        
        this.checkLevelUp();
        return totalExp;
    }

    checkLevelUp() {
        const { player } = this.gameState;
        
        while (player.experience >= player.experienceToNext) {
            player.experience -= player.experienceToNext;
            player.level++;
            player.maxEnergy += 10;
            player.energy = player.maxEnergy; // Full heal on level up
            player.experienceToNext = Math.floor(player.experienceToNext * 1.5);
            
            // Unlock new abilities or areas based on level
            this.processLevelUpRewards(player.level);
        }
    }

    checkSkillLevelUp(skill, experience) {
        // Simplified skill progression
        const currentLevel = this.gameState.player.skills[skill];
        const expNeeded = currentLevel * 100;
        
        if (experience >= expNeeded) {
            this.gameState.player.skills[skill]++;
            return true;
        }
        return false;
    }

    processLevelUpRewards(level) {
        const rewards = {
            2: { equipment: 'improved_scanner', unlock: 'SECTOR_BETA' },
            3: { ability: 'stealth_mode', credits: 200 },
            5: { equipment: 'advanced_firewall', unlock: 'SECTOR_GAMMA' },
            7: { ability: 'energy_efficiency', maxEnergy: 150 },
            10: { equipment: 'quantum_intrusion', unlock: 'DEEP_NET' }
        };
        
        const reward = rewards[level];
        if (reward) {
            if (reward.equipment) {
                this.upgradeEquipment(reward.equipment);
            }
            if (reward.unlock) {
                this.gameState.unlockedAreas.push(reward.unlock);
            }
            if (reward.ability) {
                this.unlockAbility(reward.ability);
            }
            if (reward.credits) {
                this.gameState.player.credits += reward.credits;
            }
        }
    }

    upgradeEquipment(equipmentType) {
        // Equipment upgrade logic
        const upgrades = {
            'improved_scanner': { range: 3, efficiency: 1.2 },
            'advanced_firewall': { protection: 2, stealth: 1.3 },
            'quantum_intrusion': { hackPower: 2, energyEfficiency: 0.8 }
        };
        
        // Store upgrade in player equipment
        this.gameState.player.equipment[equipmentType] = upgrades[equipmentType];
    }

    unlockAbility(abilityName) {
        if (!this.gameState.player.abilities) {
            this.gameState.player.abilities = [];
        }
        this.gameState.player.abilities.push(abilityName);
    }

    // Depth Enhancement: Dynamic Events
    triggerRandomEvent() {
        const events = [
            {
                name: 'security_sweep',
                description: 'Security sweep detected! Alert level increases.',
                effect: () => this.gameState.alertLevel += 20
            },
            {
                name: 'data_leak',
                description: 'Data leak discovered! Gain bonus credits.',
                effect: () => this.gameState.player.credits += 50
            },
            {
                name: 'system_glitch',
                description: 'System glitch provides temporary stealth bonus.',
                effect: () => this.gameState.stealthBonus = 30
            }
        ];
        
        if (Math.random() < 0.1) { // 10% chance
            const event = events[Math.floor(Math.random() * events.length)];
            event.effect();
            return event;
        }
        return null;
    }

    // Enhanced Grid Movement
    movePlayer(direction) {
        const { grid } = this.gameState;
        const { x, y } = grid.playerPosition;
        const moves = {
            'north': { x: 0, y: -1 },
            'south': { x: 0, y: 1 },
            'east': { x: 1, y: 0 },
            'west': { x: -1, y: 0 }
        };
        
        const move = moves[direction];
        if (!move) return false;
        
        const newX = x + move.x;
        const newY = y + move.y;
        
        if (newX >= 0 && newX < grid.size && newY >= 0 && newY < grid.size) {
            if (this.consumeEnergy(5)) {
                grid.playerPosition = { x: newX, y: newY };
                grid.cells[newY][newX].discovered = true;
                grid.exploredCells.add(`${newX},${newY}`);
                
                // Process combo for successful movement
                this.processAction('move', true);
                
                // Check for random events
                const event = this.triggerRandomEvent();
                
                return { success: true, event };
            } else {
                return { success: false, reason: 'insufficient_energy' };
            }
        }
        
        return { success: false, reason: 'blocked' };
    }

    // Enhanced Scanning with Grid Integration
    performAdvancedScan() {
        const energyCost = 15;
        if (!this.consumeEnergy(energyCost)) {
            return { success: false, reason: 'insufficient_energy' };
        }
        
        const { grid } = this.gameState;
        const { x, y } = grid.playerPosition;
        const scanRange = this.getScanRange();
        const discoveredNodes = [];
        
        // Scan surrounding cells
        for (let dy = -scanRange; dy <= scanRange; dy++) {
            for (let dx = -scanRange; dx <= scanRange; dx++) {
                const cellX = x + dx;
                const cellY = y + dy;
                
                if (cellX >= 0 && cellX < grid.size && cellY >= 0 && cellY < grid.size) {
                    const cell = grid.cells[cellY][cellX];
                    if (!cell.discovered && cell.type !== 'empty') {
                        cell.discovered = true;
                        discoveredNodes.push({
                            position: { x: cellX, y: cellY },
                            type: cell.type,
                            template: this.nodeTemplates[cell.type]
                        });
                    }
                }
            }
        }
        
        // Process combo for successful scan
        const multiplier = this.processAction('scan', true);
        
        // Gain experience based on nodes discovered
        if (discoveredNodes.length > 0) {
            this.gainExperience(discoveredNodes.length * 10 * multiplier, 'analytics');
        }
        
        return {
            success: true,
            nodes: discoveredNodes,
            combo: this.gameState.currentCombo,
            multiplier: multiplier
        };
    }

    getScanRange() {
        const baseRange = 2;
        const equipment = this.gameState.player.equipment;
        const skillBonus = Math.floor(this.gameState.player.skills.analytics / 3);
        
        let range = baseRange + skillBonus;
        
        if (equipment.improved_scanner) {
            range += 1;
        }
        
        return range;
    }

    // Export game state for UI integration
    getGameState() {
        return { ...this.gameState };
    }

    // Save/Load functionality
    exportSave() {
        return JSON.stringify(this.gameState);
    }

    importSave(saveData) {
        try {
            this.gameState = { ...this.gameState, ...JSON.parse(saveData) };
            return true;
        } catch (error) {
            console.error('Failed to import save:', error);
            return false;
        }
    }
}

// Export for use in main game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridGameEngine;
} else {
    window.GridGameEngine = GridGameEngine;
}