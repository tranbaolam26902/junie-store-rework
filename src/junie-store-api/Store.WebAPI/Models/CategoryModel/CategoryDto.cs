﻿namespace Store.WebAPI.Models.CategoryModel;

public class CategoryDto
{
	public Guid Id { get; set; }

	public string Name { get; set; }

	public string UrlSlug { get; set; }

	public string Description { get; set; }

	public bool ShowOnMenu { get; set; }

	public bool IsDeleted { get; set; }

	public int ProductCount { get; set; }
}