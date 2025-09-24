using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ChatApp.Application.DTOs
{
    public class UserForSearchDto
    {
        public Guid Id { get; set; }

        public string Handle { get; set; }

        public string DisplayName { get; set; }

        public string AvatarUrl { get; set; }
    }
}