using System;
using System.ComponentModel.DataAnnotations;

namespace BornOtomasyon.API.Models.DTOs
{
    public class FormDataDto
    {
        [Required]
        [MaxLength(100)]
        public string Text1 { get; set; } = string.Empty;

        [Required]
        [Range(50, 100)]
        public int Num1 { get; set; }

        [Required]
        public DateTime Date1 { get; set; }
    }
}