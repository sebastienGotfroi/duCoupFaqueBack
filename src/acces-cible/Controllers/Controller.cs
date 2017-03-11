using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using acces_cible.data;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace acces_cible.Controllers
{
    [Route("api/")]
    public class LeController : Controller
    {
        // GET: api/values
        [HttpGet("bus/{position}")]
        public Bus Get(string position)
        {
            return new Bus
            {
                ligne = new Ligne { nom = "nom de la ligne", stops = new Position[1] { new Position { lat = "1", lng = "2" } } },
                positionsPol = new Position[1] { new Position { lat = "1", lng = "2" } }
            };
        }
    }
}
