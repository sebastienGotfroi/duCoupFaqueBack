using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace acces_cible.data
{
    public class Bus
    {
        public Position[] positionsPol { get; set; }
        public Ligne ligne { get; set; }
    }

    public class Ligne
    {
        public Position[] stops { get; set; }
        public string nom { get; set; }
    }



}
