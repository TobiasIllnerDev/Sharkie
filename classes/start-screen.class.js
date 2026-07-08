class StartScreen {
  buttons = [
    { name: 'start', x: 250, y: 150, width: 220, height: 60, text: 'SPIEL STARTEN' },
    { name: 'settings', x: 250, y: 230, width: 220, height: 60, text: 'EINSTELLUNGEN' },
    { name: 'tutorial', x: 250, y: 310, width: 220, height: 60, text: 'ANLEITUNG' }
  ];

  draw(ctx) {
    ctx.fillStyle = 'rgba(0, 50, 100, 0.8)';
    ctx.fillRect(0, 0, 720, 480);

    ctx.font = '60px Luckiest Guy';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('SHARKIE', 360, 100);

    this.buttons.forEach(button => {
      ctx.fillStyle = '#1a5fb4';
      ctx.fillRect(button.x, button.y, button.width, button.height);
      ctx.font = '24px Luckiest Guy';
      ctx.fillStyle = 'white';
      ctx.fillText(button.text, button.x + 110, button.y + 35);
    });
  }

  checkClick(x, y) {
    
  }
}