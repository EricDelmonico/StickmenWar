// Author: Eric Delmonico
//
// enemyAI.js will handle the enemy's spawning logic. I've
// separated it into its own class to make changing it easier.

export class EnemyAI {
    // TODO: This could probably be done in a better way than with a callback.......
    constructor(spawnCallback) {
        // intervals are in seconds
        this.spawnInterval = 0.5;
        this.waveInterval = 4;

        this.currentSeconds = 0;
        this.waitForNewWave = true;
        this.enemiesSpawnedForWave = 0;
        // TODO: Scale?
        this.enemiesPerWave = 5;

        this.spawnCallback = spawnCallback;
    }

    update(dt, liveEnemies) {
        this.currentSeconds += dt;

        // If we need a new wave and waveInterval seconds have passed, start spawning new wave
        if (this.waitForNewWave && this.currentSeconds > this.waveInterval) {
            this.currentSeconds = 0;
            this.waitForNewWave = false;
        }
        // Wave is now spawning
        else if (!this.waitForNewWave && this.currentSeconds > this.spawnInterval && this.enemiesSpawnedForWave < this.enemiesPerWave) {
            let ranged = Math.random() > 0.5;
            this.spawnCallback(ranged);
            this.currentSeconds = 0;
            this.enemiesSpawnedForWave++;
        }
        // Wave is over
        else if (!this.waitForNewWave && this.enemiesSpawnedForWave >= this.enemiesPerWave && liveEnemies == 0) {
            this.waitForNewWave = true;
            this.currentSeconds = 0;
            this.enemiesSpawnedForWave = 0;
        }
    }
}