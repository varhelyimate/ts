//  === GALAXY STRIKE ===
//  Profi MakeCode Arcade játék Pythonban (hibamentes verzió)
scene.setBackgroundColor(1)
effects.starField.startScreenEffect()
//  --- Játékos (űrhajó) ---
let ship = sprites.create(img`
    . . . . . . f f f f . . . . . .
    . . . . . f 1 1 1 1 f . . . . .
    . . . . f 1 1 1 1 1 1 f . . . .
    . . . f 1 1 1 1 1 1 1 1 f . . .
    . . . f 1 1 1 1 1 1 1 1 f . . .
    . . . . f 1 1 1 1 1 1 f . . . .
    . . . . . f 1 1 1 1 f . . . . .
    . . . . . . f f f f . . . . . .
`, SpriteKind.Player)
ship.setPosition(80, 100)
controller.moveSprite(ship, 100, 0)
ship.setFlag(SpriteFlag.StayInScreen, true)
info.setLife(3)
info.setScore(0)
//  --- Lövés ---
controller.A.onEvent(ControllerButtonEvent.Pressed, function shoot() {
    let projectile = sprites.createProjectileFromSprite(img`
        . . 2 . .
        . 2 2 2 .
        2 2 2 2 2
        . 2 2 2 .
        . . 2 . .
    `, ship, 0, -100)
    music.pewPew.play()
})
//  --- Ellenségek ---
function spawn_enemy() {
    let enemy: Sprite;
    if (randint(0, 1) == 0) {
        enemy = sprites.create(img`
            . . . 4 4 4 . . .
            . . 4 5 5 5 4 . .
            . 4 5 5 5 5 5 4 .
            . . 4 5 5 5 4 . .
            . . . 4 4 4 . . .
        `, SpriteKind.Enemy)
        enemy.vy = randint(30, 60)
    } else {
        enemy = sprites.create(img`
            . . . 9 9 9 . . .
            . 9 9 9 9 9 9 9 .
            . . . 9 9 9 . . .
        `, SpriteKind.Enemy)
        enemy.vy = randint(70, 100)
    }
    
    enemy.setPosition(randint(10, 150), 0)
}

//  --- Power-up (életbónusz) ---
function spawn_powerup() {
    let powerup_sprite = sprites.create(img`
        . . c c c . .
        . c 7 7 7 c .
        c 7 7 7 7 7 c
        . c 7 7 7 c .
        . . c c c . .
    `, SpriteKind.Food)
    powerup_sprite.setPosition(randint(10, 150), 0)
    powerup_sprite.vy = 40
}

//  --- Ütközések ---
sprites.onOverlap(SpriteKind.Projectile, SpriteKind.Enemy, function hit_enemy(projectile: Sprite, enemy: Sprite) {
    enemy.destroy(effects.fire, 200)
    projectile.destroy()
    info.changeScoreBy(1)
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Enemy, function player_hit(ship: Sprite, enemy: Sprite) {
    enemy.destroy(effects.disintegrate, 200)
    info.changeLifeBy(-1)
    music.smallCrash.play()
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Food, function powerup_pickup(ship: Sprite, powerup_sprite: Sprite) {
    powerup_sprite.destroy(effects.hearts, 200)
    info.changeLifeBy(1)
    music.powerUp.play()
})
//  --- Folyamatos frissítés ---
game.onUpdate(function main_update() {
    if (randint(0, 100) < 4) {
        spawn_enemy()
    }
    
    if (randint(0, 200) == 0) {
        spawn_powerup()
    }
    
})
//  --- Növekvő nehézség ---
game.onUpdateInterval(12000, function harder() {
    music.baDing.play()
    game.splash("Nehézség növekszik!")
    for (let i = 0; i < 3; i++) {
        spawn_enemy()
    }
})
