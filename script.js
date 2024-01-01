function getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) color += letters[Math.floor(Math.random() * 16)];
    return color;
  }
  const canvas = document.querySelector(".canvas");
  const c = canvas.getContext("2d");
  
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const midx = canvas.width / 2;
  const midy = canvas.height / 2;

  class player {
    constructor(x, y, radius) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = 'white';
    }
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
    }
  }

  const friction = 0.98;

  class Particle {
    constructor(x , y , radius , color , velocity){
        this.x=x
        this.y=y
        this.radius=radius
        this.color=color
        this.velocity=velocity
        this.alpha=1
    }

    draw() {
        c.save()
        c.globalAlpha = this.alpha
        c.beginPath()
        c.arc(this.x,this.y, this.radius, 0, Math.PI * 2, false)
        c.fillStyle= this.color
        c.fill()
        c.restore()
    }

    update(){
    	  this.draw()
        this.velocity.x*=friction
        this.velocity.y*=friction
        this.x=this.x+this.velocity.x
        this.y=this.y+this.velocity.y
        this.alpha-=0.01
    }
}

  
  class Projectile {
    constructor(x, y, radius, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = 'white';
      this.velocity = velocity;
    }
  
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
    }
  
    update() {
      this.draw();
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    }
  }
  
  class Enemy {
    constructor(x, y, radius, velocity) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.color = getRandomColor();
      this.velocity = velocity;
    }
  
    draw() {
      c.beginPath();
      c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
      c.fillStyle = this.color;
      c.fill();
    }
    update() {
      this.draw();
      this.x = this.x + this.velocity.x;
      this.y = this.y + this.velocity.y;
    }
  }
  const p = new player(midx, midy, 10);
  
  const projectiles = [];
  const enemies = [];
  const particles = []
  
  function spwanEnemies() {
    setInterval(() => {
      const radius =Math.random()*(30-10)+10
      let x
      let y
      if(Math.random()>0.5){
        x = Math.random() < 0.5 ? 0 - radius : (canvas.width + radius)
        y = Math.random() * canvas.height
      }

      else {
        x=Math.random()*canvas.width
        y=Math.random()<0.5 ? 0-radius : (canvas.height + radius)
      }
  
      const angle = Math.atan2(midy - y, midx - x);
   
      const velocity = {
        x: Math.cos(angle)*1.5,
        y: Math.sin(angle)*1.5
      };
      enemies.push(new Enemy(x, y, radius, velocity));
    }, 1000);
  }
  let animationId
  function animate() {
    animationId=requestAnimationFrame(animate);
    c.fillStyle = 'rgb(0,0,0,0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height);
    p.draw();
  
    particles.forEach((particle,index)=>{
      if(particle.alpha<=0){
        particles.splice(index,1)
      }
      else
        particle.update()
    })

    projectiles.forEach((projectile,index) => {
      projectile.update();

      if(projectile.x+projectile.radius<0 ||
        projectile.y+projectile.radius<0||
        projectile.x-projectile.radius>canvas.weight||
        projectile.y-projectile.radius>canvas.height){
          setTimeout(()=>{
            projectiles.splice(index,1)
          })
        }
    });
  
    enemies.forEach((enemy,index) => {
      enemy.update();

      const dist = Math.hypot(player.x-enemy.x,player.y-enemy.y)
      //end game
      if(dist-enemy.radius-player.radius<1){
        cancelAnimationFrame(animationId)
      }

      projectiles.forEach((projectile,guliIndex)=>{
        const distance = Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y)

        //when guli hit enemy
        if(distance - enemy.radius- projectile.radius <1){

          for(let i=0;i<enemy.radius*3;i++){
            particles.push(new Particle(projectile.x , projectile.y,Math.random()*3,enemy.color,{
              x:(Math.random()-0.5)*(Math.random()*8),
              y:(Math.random()-0.5)*(Math.random()*8)
            }))
          }
          if(enemy.radius -10 > 10){
            gsap.to(enemy,{
              radius : enemy.radius - 10
            })
            setTimeout(()=>{
              projectiles.splice(guliIndex,1)
            },0)
          }
          else{
          setTimeout(()=>{
          enemies.splice(index,1)
          projectiles.splice(guliIndex,1)
          },0)
        }
        }
      })
    });
  }
  
  window.addEventListener("click", (event) => {
    const angle = Math.atan2(
      event.clientY - canvas.height / 2,
      event.clientX - canvas.width / 2
    );
  
    const velocity = {
      x: Math.cos(angle) * 5,
      y: Math.sin(angle) * 5,
    };
    projectiles.push(
      new Projectile(canvas.width / 2, canvas.height / 2, 5 , velocity)
    );
  });
  
  animate();
  spwanEnemies();
