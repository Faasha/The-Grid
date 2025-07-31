// Benchmark Test: Enhanced Game Mechanics Test Suite
// Comprehensive testing for The Grid enhanced features

class SimpleTestFramework {
    constructor() {
        this.tests = [];
        this.results = {
            passed: 0,
            failed: 0,
            total: 0
        };
    }

    test(name, testFunction) {
        this.tests.push({ name, testFunction });
    }

    async runAll() {
        console.log('🚀 Starting Enhanced Grid Test Suite...\n');
        
        for (const test of this.tests) {
            try {
                await test.testFunction();
                this.results.passed++;
                console.log(`✅ ${test.name}`);
            } catch (error) {
                this.results.failed++;
                console.log(`❌ ${test.name}: ${error.message}`);
            }
            this.results.total++;
        }
        
        this.printSummary();
    }

    printSummary() {
        console.log('\n📊 Test Results Summary:');
        console.log(`Total Tests: ${this.results.total}`);
        console.log(`Passed: ${this.results.passed}`);
        console.log(`Failed: ${this.results.failed}`);
        console.log(`Success Rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`);
    }

    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }

    assertEqual(actual, expected, message) {
        if (actual !== expected) {
            throw new Error(message || `Expected ${expected}, got ${actual}`);
        }
    }

    assertGreaterThan(actual, threshold, message) {
        if (actual <= threshold) {
            throw new Error(message || `Expected ${actual} to be greater than ${threshold}`);
        }
    }
}

// Initialize test framework
const testFramework = new SimpleTestFramework();

// Benchmark Test: Grid Game Engine Initialization
testFramework.test('GridGameEngine - Initialization', () => {
    const engine = new GridGameEngine();
    
    testFramework.assert(engine, 'Engine should be created');
    testFramework.assert(engine.gameState, 'Game state should be initialized');
    testFramework.assertEqual(engine.gameState.player.level, 1, 'Player should start at level 1');
    testFramework.assertEqual(engine.gameState.player.credits, 100, 'Player should start with 100 credits');
    testFramework.assertEqual(engine.gameState.grid.size, 8, 'Grid should be 8x8');
});

// Benchmark Test: Player Movement System
testFramework.test('Player Movement - All Directions', () => {
    const engine = new GridGameEngine();
    const initialPosition = { ...engine.gameState.grid.playerPosition };
    
    // Test movement north
    const northResult = engine.movePlayer('north');
    testFramework.assert(northResult.success, 'North movement should succeed');
    testFramework.assertEqual(
        engine.gameState.grid.playerPosition.y, 
        initialPosition.y - 1, 
        'Y position should decrease when moving north'
    );
    
    // Test movement south (back to start)
    const southResult = engine.movePlayer('south');
    testFramework.assert(southResult.success, 'South movement should succeed');
    testFramework.assertEqual(
        engine.gameState.grid.playerPosition.y, 
        initialPosition.y, 
        'Should return to initial Y position'
    );
    
    // Test movement east
    const eastResult = engine.movePlayer('east');
    testFramework.assert(eastResult.success, 'East movement should succeed');
    testFramework.assertEqual(
        engine.gameState.grid.playerPosition.x, 
        initialPosition.x + 1, 
        'X position should increase when moving east'
    );
    
    // Test movement west (back to start)
    const westResult = engine.movePlayer('west');
    testFramework.assert(westResult.success, 'West movement should succeed');
    testFramework.assertEqual(
        engine.gameState.grid.playerPosition.x, 
        initialPosition.x, 
        'Should return to initial X position'
    );
});

// Benchmark Test: Energy System
testFramework.test('Energy System - Consumption and Regeneration', () => {
    const engine = new GridGameEngine();
    const initialEnergy = engine.gameState.player.energy;
    
    // Test energy consumption
    const consumed = engine.consumeEnergy(25);
    testFramework.assert(consumed, 'Energy consumption should succeed');
    testFramework.assertEqual(
        engine.gameState.player.energy, 
        initialEnergy - 25, 
        'Energy should decrease by consumed amount'
    );
    
    // Test energy regeneration
    const beforeRegen = engine.gameState.player.energy;
    engine.regenerateEnergy(10);
    testFramework.assertEqual(
        engine.gameState.player.energy, 
        beforeRegen + 10, 
        'Energy should increase by regeneration amount'
    );
    
    // Test energy cap
    engine.regenerateEnergy(1000);
    testFramework.assertEqual(
        engine.gameState.player.energy, 
        engine.gameState.player.maxEnergy, 
        'Energy should not exceed maximum'
    );
    
    // Test insufficient energy
    engine.gameState.player.energy = 10;
    const insufficientResult = engine.consumeEnergy(20);
    testFramework.assert(!insufficientResult, 'Should fail when insufficient energy');
});

// Benchmark Test: Scanning System
testFramework.test('Advanced Scanning - Discovery and Range', () => {
    const engine = new GridGameEngine();
    
    // Test basic scan functionality
    const scanResult = engine.performAdvancedScan();
    testFramework.assert(scanResult.success, 'Scan should succeed with sufficient energy');
    testFramework.assert(Array.isArray(scanResult.nodes), 'Scan should return nodes array');
    testFramework.assert(scanResult.combo >= 1, 'Combo should be at least 1');
    testFramework.assert(scanResult.multiplier >= 1, 'Multiplier should be at least 1');
    
    // Test scan range affects discovery
    const initialRange = engine.getScanRange();
    testFramework.assertGreaterThan(initialRange, 0, 'Scan range should be positive');
    
    // Test energy requirement
    engine.gameState.player.energy = 10; // Less than required 15
    const lowEnergyResult = engine.performAdvancedScan();
    testFramework.assert(!lowEnergyResult.success, 'Scan should fail with insufficient energy');
    testFramework.assertEqual(lowEnergyResult.reason, 'insufficient_energy', 'Should return correct failure reason');
});

// Benchmark Test: Combo System
testFramework.test('Combo System - Chain Building', () => {
    const engine = new GridGameEngine();
    
    // Test initial combo state
    testFramework.assertEqual(engine.gameState.currentCombo, 0, 'Combo should start at 0');
    testFramework.assertEqual(engine.gameState.comboMultiplier, 1, 'Multiplier should start at 1');
    
    // Test successful action combo
    const multiplier1 = engine.processAction('scan', true);
    testFramework.assertEqual(engine.gameState.currentCombo, 1, 'First action should set combo to 1');
    testFramework.assertEqual(multiplier1, 1, 'First action multiplier should be 1');
    
    // Test chainable action
    const multiplier2 = engine.processAction('move', true);
    testFramework.assertGreaterThan(engine.gameState.currentCombo, 1, 'Chainable action should increase combo');
    testFramework.assertGreaterThan(multiplier2, 1, 'Combo should increase multiplier');
    
    // Test failed action breaks combo
    engine.processAction('hack', false);
    testFramework.assertEqual(engine.gameState.currentCombo, 0, 'Failed action should reset combo');
    testFramework.assertEqual(engine.gameState.comboMultiplier, 1, 'Failed action should reset multiplier');
});

// Benchmark Test: Experience and Leveling
testFramework.test('Experience System - Gaining and Leveling', () => {
    const engine = new GridGameEngine();
    const initialLevel = engine.gameState.player.level;
    const initialExp = engine.gameState.player.experience;
    
    // Test experience gain
    const expGained = engine.gainExperience(50);
    testFramework.assertGreaterThan(expGained, 0, 'Should gain experience');
    testFramework.assertGreaterThan(
        engine.gameState.player.experience, 
        initialExp, 
        'Player experience should increase'
    );
    
    // Test level up
    const expNeeded = engine.gameState.player.experienceToNext;
    engine.gainExperience(expNeeded);
    testFramework.assertGreaterThan(
        engine.gameState.player.level, 
        initialLevel, 
        'Player should level up'
    );
    
    // Test skill-specific experience
    const initialHackingSkill = engine.gameState.player.skills.hacking;
    engine.gainExperience(200, 'hacking');
    // Note: Skill leveling is simplified, so we just check it doesn't break
    testFramework.assert(
        engine.gameState.player.skills.hacking >= initialHackingSkill, 
        'Hacking skill should not decrease'
    );
});

// Benchmark Test: Grid Generation and Cell Types
testFramework.test('Grid Generation - Cell Types and Distribution', () => {
    const engine = new GridGameEngine();
    const grid = engine.gameState.grid;
    
    // Test grid structure
    testFramework.assertEqual(grid.cells.length, grid.size, 'Grid should have correct number of rows');
    testFramework.assertEqual(grid.cells[0].length, grid.size, 'Grid should have correct number of columns');
    
    // Test center cell is home
    const centerCell = grid.cells[3][3];
    testFramework.assertEqual(centerCell.type, 'home', 'Center cell should be home');
    testFramework.assert(centerCell.discovered, 'Home cell should be discovered initially');
    
    // Test cell type variety
    const cellTypes = new Set();
    for (let y = 0; y < grid.size; y++) {
        for (let x = 0; x < grid.size; x++) {
            cellTypes.add(grid.cells[y][x].type);
        }
    }
    testFramework.assertGreaterThan(cellTypes.size, 1, 'Should have multiple cell types');
    
    // Test explored cells tracking
    testFramework.assert(grid.exploredCells.has('3,3'), 'Starting position should be in explored cells');
});

// Benchmark Test: Mission System
testFramework.test('Mission System - Initialization and Progress', () => {
    const engine = new GridGameEngine();
    
    // Test mission initialization
    testFramework.assert(Array.isArray(engine.gameState.missions), 'Missions should be an array');
    testFramework.assertGreaterThan(engine.gameState.missions.length, 0, 'Should have missions available');
    testFramework.assert(engine.gameState.currentMission, 'Should have a current mission');
    
    // Test mission structure
    const mission = engine.gameState.currentMission;
    testFramework.assert(mission.title, 'Mission should have a title');
    testFramework.assert(mission.description, 'Mission should have a description');
    testFramework.assert(Array.isArray(mission.objectives), 'Mission should have objectives');
    testFramework.assert(mission.rewards, 'Mission should have rewards');
});

// Benchmark Test: Save/Load System
testFramework.test('Save/Load System - Data Persistence', () => {
    const engine = new GridGameEngine();
    
    // Modify game state
    engine.gameState.player.level = 5;
    engine.gameState.player.credits = 500;
    engine.movePlayer('north');
    
    // Test save
    const saveData = engine.exportSave();
    testFramework.assert(saveData, 'Should generate save data');
    testFramework.assert(typeof saveData === 'string', 'Save data should be a string');
    
    // Test load
    const newEngine = new GridGameEngine();
    const loadResult = newEngine.importSave(saveData);
    testFramework.assert(loadResult, 'Should successfully load save data');
    testFramework.assertEqual(newEngine.gameState.player.level, 5, 'Should restore player level');
    testFramework.assertEqual(newEngine.gameState.player.credits, 500, 'Should restore player credits');
    
    // Test invalid save data
    const invalidLoadResult = newEngine.importSave('invalid json');
    testFramework.assert(!invalidLoadResult, 'Should fail with invalid save data');
});

// Benchmark Test: Node Templates and Rewards
testFramework.test('Node Templates - Structure and Rewards', () => {
    const engine = new GridGameEngine();
    
    // Test node templates exist
    testFramework.assert(engine.nodeTemplates, 'Node templates should exist');
    
    // Test specific node types
    const dataNode = engine.nodeTemplates.data_node;
    testFramework.assert(dataNode, 'Data node template should exist');
    testFramework.assert(dataNode.name, 'Node should have a name');
    testFramework.assert(dataNode.security, 'Node should have security level');
    testFramework.assert(dataNode.rewards, 'Node should have rewards');
    testFramework.assert(dataNode.risks, 'Node should have risks');
    testFramework.assertGreaterThan(dataNode.hackDifficulty, 0, 'Node should have hack difficulty');
    
    // Test security node has higher difficulty
    const securityNode = engine.nodeTemplates.security_node;
    testFramework.assertGreaterThan(
        securityNode.hackDifficulty, 
        dataNode.hackDifficulty, 
        'Security node should be harder than data node'
    );
});

// Benchmark Test: Equipment and Upgrades
testFramework.test('Equipment System - Upgrades and Effects', () => {
    const engine = new GridGameEngine();
    const initialScanRange = engine.getScanRange();
    
    // Test equipment upgrade
    engine.upgradeEquipment('improved_scanner');
    const upgradedScanRange = engine.getScanRange();
    testFramework.assertGreaterThan(
        upgradedScanRange, 
        initialScanRange, 
        'Improved scanner should increase scan range'
    );
    
    // Test equipment storage
    testFramework.assert(
        engine.gameState.player.equipment.improved_scanner, 
        'Equipment should be stored in player data'
    );
});

// Benchmark Test: Random Events
testFramework.test('Random Events - Generation and Effects', () => {
    const engine = new GridGameEngine();
    
    // Test random event generation (may or may not trigger)
    let eventTriggered = false;
    for (let i = 0; i < 100; i++) { // Try multiple times to catch random events
        const event = engine.triggerRandomEvent();
        if (event) {
            eventTriggered = true;
            testFramework.assert(event.name, 'Event should have a name');
            testFramework.assert(event.description, 'Event should have a description');
            testFramework.assert(typeof event.effect === 'function', 'Event should have an effect function');
            break;
        }
    }
    
    // Note: Random events may not always trigger, so we don't assert they must occur
    console.log(eventTriggered ? '  Random event system functional' : '  Random events rare (expected)');
});

// Performance Benchmark Tests
testFramework.test('Performance - Grid Operations', () => {
    const startTime = performance.now();
    
    // Test rapid operations
    const engine = new GridGameEngine();
    for (let i = 0; i < 100; i++) {
        engine.movePlayer('north');
        engine.movePlayer('south');
        engine.performAdvancedScan();
        engine.gainExperience(10);
    }
    
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    testFramework.assertGreaterThan(1000, duration, 'Performance test should complete in under 1 second');
    console.log(`  Performance: 400 operations completed in ${duration.toFixed(2)}ms`);
});

// Integration Test
testFramework.test('Integration - Complete Game Flow', () => {
    const engine = new GridGameEngine();
    
    // Simulate a complete game session
    // 1. Scan for nodes
    const scanResult = engine.performAdvancedScan();
    testFramework.assert(scanResult.success, 'Initial scan should succeed');
    
    // 2. Move around the grid
    for (const direction of ['north', 'east', 'south', 'west']) {
        const moveResult = engine.movePlayer(direction);
        testFramework.assert(moveResult.success, `Movement ${direction} should succeed`);
    }
    
    // 3. Gain experience and level up
    const initialLevel = engine.gameState.player.level;
    engine.gainExperience(engine.gameState.player.experienceToNext);
    testFramework.assertGreaterThan(
        engine.gameState.player.level, 
        initialLevel, 
        'Should level up after sufficient experience'
    );
    
    // 4. Test save/load cycle
    const saveData = engine.exportSave();
    const newEngine = new GridGameEngine();
    newEngine.importSave(saveData);
    testFramework.assertEqual(
        newEngine.gameState.player.level, 
        engine.gameState.player.level, 
        'Save/load should preserve game state'
    );
});

// Export test framework for use in other contexts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { testFramework, SimpleTestFramework };
} else {
    window.GridTestSuite = { testFramework, SimpleTestFramework };
}

// Auto-run tests if this file is executed directly
if (typeof window !== 'undefined' && typeof GridGameEngine !== 'undefined') {
    // Browser environment with game engine available
    console.log('🎮 Browser environment detected - running tests...');
    testFramework.runAll();
} else if (typeof module !== 'undefined' && module.exports) {
    // Node.js environment
    console.log('📦 Node.js environment detected - tests exported for manual execution');
} else {
    console.log('⚠️  Test environment unclear - tests defined but not executed');
}