/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import globals from "core/globals";
import creepFailsafe from "./creepFailsafe";
import creepFarm from "./creepFarm";

export default {
  run(creep: Creep): void {
    creepFailsafe(creep);
    if (creep.memory.working && creep.store[RESOURCE_ENERGY] === 0) {
      creep.memory.working = false;
    }
    if (!creep.memory.working && creep.store.getFreeCapacity() === 0) {
      creep.memory.working = true;
    }

    if (!creep.memory.working) {
      creepFarm(creep, globals.COLOR_HARVESTER);
    } else {
      // TODO: FIX THIS ABOMINATION
      const targets: any[] | undefined = creep.room.find<any>(FIND_STRUCTURES, {
        filter: struct => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const struct2 = struct as any;
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          if (struct2.store) {
            if (struct2.store.getFreeCapacity([RESOURCE_ENERGY]) > 0) {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-return
              return struct2;
            } else {
              return;
            }
          } else {
            return;
          }
        },
      });

      if (targets.length) {
        creep.say(globals.MSG_WORKING);
        if (creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
          creep.moveTo(targets[0], { visualizePathStyle: { stroke: globals.COLOR_HARVESTER } });
        }
      }
    }
  },
};
