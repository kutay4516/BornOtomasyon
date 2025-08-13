using System;
using System.ComponentModel.DataAnnotations;

namespace BornOtomasyon.API.Models
{
    public class FormData
    {
        public int Id { get; set; }

        [Required]
        [MaxLength(100)]
        public string Text1 { get; set; } = string.Empty;

        [Required]
        [Range(50, 100)]
        public int Num1 { get; set; }

        [Required]
        public DateTime Date1 { get; set; }

        [Required]
        public string UserId { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation property
        public virtual ApplicationUser User { get; set; } = null!;
    }
}