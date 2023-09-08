﻿using Store.Core.Contracts;
using Store.Core.Entities;
using Store.Core.Queries;

namespace Store.Services.Shops;

public interface ICollectionRepository
{
	Task<Product> GetProductByIdAsync(Guid id, CancellationToken cancellationToken = default);
	
	Task<Product> GetProductBySlug(string slug, CancellationToken cancellationToken = default);

	Task<bool> IsProductSlugExistedAsync(Guid productId, string slug, CancellationToken cancellationToken = default);

	Task<bool> IsProductExistedAsync(Guid productId, string name, CancellationToken cancellationToken = default);

	Task<Product> AddOrUpdateProductAsync(Product product, Guid userId, string note = "", CancellationToken cancellationToken = default);

	Task<IPagedList<Product>> GetPagedProductsAsync(IProductQuery productQuery, IPagingParams pagingParams,
		CancellationToken cancellationToken = default);

	Task<IList<Product>> GetTopSaleAsync(CancellationToken cancellationToken = default);
	
	Task<IList<Product>> GetRelatedProductsAsync(string slug, int num = 10, CancellationToken cancellationToken = default);

	Task<IPagedList<T>> GetPagedProductsAsync<T>(
		IProductQuery condition,
		IPagingParams pagingParams,
		Func<IQueryable<Product>, IQueryable<T>> mapper);

	Task<IPagedList<T>> GetPagedProductHistoriesAsync<T>(
		IProductHistoryQuery condition,
		IPagingParams pagingParams,
		Func<IQueryable<ProductHistory>, IQueryable<T>> mapper);

	Task<bool> SetImageUrlAsync(Guid productId, string imageUrl, CancellationToken cancellationToken = default);
	
	Task<IList<Picture>> GetImageUrlsAsync(Guid productId, CancellationToken cancellationToken = default);
	
	Task<bool> DeleteImageUrlsAsync(Guid productId, CancellationToken cancellationToken = default);
	
	Task<bool> DeleteProductAsync(Guid productId, CancellationToken cancellationToken = default);

	Task<bool> DeleteProductHistoryAsync(Guid historyId, CancellationToken cancellationToken = default);

	Task<bool> ToggleDeleteProductAsync(Guid productId, Guid userId, string reason, CancellationToken cancellationToken = default);
}