# === GALAXY STRIKE ===
# Profi MakeCode Arcade játék Pythonban (hibamentes verzió)

scene.set_background_color(1)
effects.star_field.start_screen_effect()

# --- Játékos (űrhajó) ---
ship = sprites.create(img("""
    . . . . . . f f f f . . . . . .
    . . . . . f 1 1 1 1 f . . . . .
    . . . . f 1 1 1 1 1 1 f . . . .
    . . . f 1 1 1 1 1 1 1 1 f . . .
    . . . f 1 1 1 1 1 1 1 1 f . . .
    . . . . f 1 1 1 1 1 1 f . . . .
    . . . . . f 1 1 1 1 f . . . . .
    . . . . . . f f f f . . . . . .
"""), SpriteKind.player)

ship.set_position(80, 100)
controller.move_sprite(ship, 100, 0)
ship.set_flag(SpriteFlag.STAY_IN_SCREEN, True)

info.set_life(3)
info.set_score(0)

# --- Lövés ---
def shoot():
    projectile = sprites.create_projectile_from_sprite(img("""
        . . 2 . .
        . 2 2 2 .
        2 2 2 2 2
        . 2 2 2 .
        . . 2 . .
    """), ship, 0, -100)
    music.pew_pew.play()
controller.A.on_event(ControllerButtonEvent.PRESSED, shoot)

# --- Ellenségek ---
def spawn_enemy():
    if randint(0, 1) == 0:
        enemy = sprites.create(img("""
            . . . 4 4 4 . . .
            . . 4 5 5 5 4 . .
            . 4 5 5 5 5 5 4 .
            . . 4 5 5 5 4 . .
            . . . 4 4 4 . . .
        """), SpriteKind.enemy)
        enemy.vy = randint(30, 60)
    else:
        enemy = sprites.create(img("""
            . . . 9 9 9 . . .
            . 9 9 9 9 9 9 9 .
            . . . 9 9 9 . . .
        """), SpriteKind.enemy)
        enemy.vy = randint(70, 100)
    enemy.set_position(randint(10, 150), 0)

# --- Power-up (életbónusz) ---
def spawn_powerup():
    powerup_sprite = sprites.create(img("""
        . . c c c . .
        . c 7 7 7 c .
        c 7 7 7 7 7 c
        . c 7 7 7 c .
        . . c c c . .
    """), SpriteKind.food)
    powerup_sprite.set_position(randint(10, 150), 0)
    powerup_sprite.vy = 40

# --- Ütközések ---
def hit_enemy(projectile, enemy):
    enemy.destroy(effects.fire, 200)
    projectile.destroy()
    info.change_score_by(1)
sprites.on_overlap(SpriteKind.projectile, SpriteKind.enemy, hit_enemy)

def player_hit(ship, enemy):
    enemy.destroy(effects.disintegrate, 200)
    info.change_life_by(-1)
    music.small_crash.play()
sprites.on_overlap(SpriteKind.player, SpriteKind.enemy, player_hit)

def powerup_pickup(ship, powerup_sprite):
    powerup_sprite.destroy(effects.hearts, 200)
    info.change_life_by(1)
    music.power_up.play()
sprites.on_overlap(SpriteKind.player, SpriteKind.food, powerup_pickup)

# --- Folyamatos frissítés ---
def main_update():
    if randint(0, 100) < 4:
        spawn_enemy()
    if randint(0, 200) == 0:
        spawn_powerup()
game.on_update(main_update)

# --- Növekvő nehézség ---
def harder():
    music.ba_ding.play()
    game.splash("Nehézség növekszik!")
    for i in range(3):
        spawn_enemy()
game.on_update_interval(12000, harder)
