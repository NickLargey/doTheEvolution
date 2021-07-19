// initialize kaboom context
const k = kaboom();

kaboom({
  global: true,
  fullscreen: true,
  scale: 1,
  debug: true,
  clearColor: [0, 0, 0, 1],
});

loadSprite("hero", "Sprites\\hero.kbmsprite");
loadSprite("baddie", "Sprites\\baddie.kbmsprite");
loadSprite("ground", "Sprites\\ground.kbmsprite");
loadSprite("virus", "Sprites\\virus.kbmsprite");
loadSprite("wall", "Sprites\\wall.kbmsprite");

scene("main", () => {
  const MOVE_SPEED = 200;
  const JUMP_FORCE = 320;

  let vCount = 0;
  let bCount = 0;
  let s = 1;
  let score = 0;

  function grow() {
    return {
      growLarger() {
        if (s <= 3) {
          s += 0.25;
          this.scale = s;
        }
      },
      shrink() {
        s = 1.25;
        this.scale = s;
      },
    };
  }

  let hero = add([
    sprite("hero"),
    pos(80, 80),
    scale(s),
    body(),
    grow(),
    "hero",
  ]);

  const v = add([sprite("virus"), pos(250, 250), body(), "virus"]);
  const b0 = add([sprite("baddie"), pos(80, 200), body(), "baddie"]);
  const b1 = add([sprite("baddie"), pos(250, 200), body(), "baddie"]);
  const b2 = add([sprite("baddie"), pos(550, 200), body(), "baddie"]);

  keyDown("right", () => {
    hero.move(MOVE_SPEED, 0);
  });

  keyDown("left", () => {
    hero.move(-MOVE_SPEED, 0);
  });

  keyPress("space", () => {
    hero.jump(JUMP_FORCE);
  });

  addLevel(
    [
      "|                 |",
      "|         x       |",
      "|                 |",
      "| x         x     |",
      "|                 |",
      "|     x         xx|",
      "|                 |",
      "| x       xx      |",
      "|                 |",
      "|xx x xxxxx xxxx x|",
    ],
    {
      width: 40,
      height: 40,
      "|": [sprite("wall"), solid()],
      x: [sprite("ground"), solid()],
      // '@' : [sprite("baddie"), body(), "baddie"]
    }
  );

  hero.collides("virus", (v) => {
    destroy(v);
    vCount -= 1;
    hero.growLarger();
  });

  hero.collides("baddie", (b) => {
    hero.shrink();
  });

  loop(rand(1, 10), () => {
    if (vCount <= 6) {
      add([
        sprite("virus"),
        pos(Math.random() * width(), Math.random() * height()),
        body(),
        "virus",
      ]);
      vCount++;
    }
  });

  loop(3, () => {
    b0.jump(JUMP_FORCE);
  });
  loop(4.2, () => {
    b1.jump(JUMP_FORCE);
  });
  loop(2, () => {
    b2.jump(JUMP_FORCE);
  });
});

// start the game
start("main");
