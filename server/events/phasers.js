import App from '../../app';
import { pubsub } from '../helpers/subscriptionManager.js';

App.on('chargePhaserBeam', ({id, beamId}) => {
  const sys = App.systems.find(s => s.id === id);
  sys.updateBeamState(beamId, 'charging');
  //sys.updateBeamCharge(beamId, 1);
  pubsub.publish('phasersUpdate', App.systems.filter(s => s.type === 'Phasers'));
});
App.on('dischargePhaserBeam', ({id, beamId}) => {
  const sys = App.systems.find(s => s.id === id);
  sys.updateBeamState(beamId, 'discharging');
  //sys.updateBeamCharge(beamId, 0);
  pubsub.publish('phasersUpdate', App.systems.filter(s => s.type === 'Phasers'));
});
App.on('firePhaserBeam', ({id, beamId}) => {
  const sys = App.systems.find(s => s.id === id);
  sys.fireBeam(beamId);
  pubsub.publish('phasersUpdate', App.systems.filter(s => s.type === 'Phasers'));
});
App.on('stopPhaserBeams', ({id}) => {
  const sys = App.systems.find(s => s.id === id);
  sys.stopBeams();
  pubsub.publish('phasersUpdate', App.systems.filter(s => s.type === 'Phasers'));
});
App.on('phaserArc', ({id, beamId, arc}) => {
  App.systems.find(s => s.id === id).updateArc(arc);
  pubsub.publish('phasersUpdate', App.systems.filter(s => s.type === 'Phasers'));
});
App.on('setPhaserBeamCharge', ({id, beamId, charge}) => {
  App.systems.find(s => s.id === id).updateBeamCharge(beamId, charge);
  pubsub.publish('phasersUpdate', App.systems.filter(s => s.type === 'Phasers'));
});
App.on('setPhaserBeamHeat', ({id, beamId, heat}) => {
  App.systems.find(s => s.id === id).updateBeamHeat(beamId, heat);
  pubsub.publish('phasersUpdate', App.systems.filter(s => s.type === 'Phasers'));
});
App.on('coolPhaserBeam', ({id, beamId}) => {
  App.systems.find(s => s.id === id).coolBeam(beamId);
  pubsub.publish('phasersUpdate', App.systems.filter(s => s.type === 'Phasers'));
});
App.on('applyPhaserCoolant', ({id, beamId}) => {
  const phaser = App.systems.find(s => s.id === id);
  const beam = phaser.beams.find(b => b.id === beamId);
  phaser.setCoolant(Math.min(1, Math.max(0, phaser.coolant - 0.005)));
  beam.setHeat(Math.min(1, Math.max(0, beam.heat - 0.01)));
  if (phaser.coolant === 0 || beam.heat === 0) phaser.coolBeam(null);
  pubsub.publish('phasersUpdate', App.systems.filter(s => s.type === 'Phasers'));
})