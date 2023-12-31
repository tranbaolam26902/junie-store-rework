﻿namespace Store.Core.Queries;

public class ProductQuery : IProductQuery
{
    public string Keyword { get; set; } = "";

    public double MinPrice { get; set; } = 0;

    public double MaxPrice { get; set; } = 0;

    public Guid? CategoryId { get; set; } = Guid.Empty;
    
    public string CategorySlug { get; set; } = "";

    public string SubCategorySlug { get; set; } = "";

    public string ProductSlug { get; set; } = "";

    public bool Active { get; set; } = false;

    public bool IsDeleted { get; set; } = false;

    public bool IsPublished { get; set; } = false;

    public int? Day { get; set; } = 0;
    
    public int? Month { get; set; } = 0;
    
    public int? Year { get; set; } = 0;
}