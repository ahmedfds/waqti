           <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Description</label>
                <textarea
                  {...formik.getFieldProps('description')}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                  placeholder="Describe your service in detail..."
                />
                {formik.touched.description && formik.errors.description && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.description}</div>
                )}
              </div>

              <div className="md:col-span-2">
                <label className="block text-gray-700 font-medium mb-2">Keywords (for search)</label>
                <input
                  type="text"
                  {...formik.getFieldProps('keywords')}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                  placeholder="e.g., web development, react, javascript, frontend"
                />
                {formik.touched.keywords && formik.errors.keywords && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.keywords}</div>
                )}
              </div>
            </div>
          </div>

          {/* Exchange Type & Pricing */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#2E86AB]">Exchange Type & Pricing</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Exchange Type</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {exchangeTypes.map(type => (
                    <label key={type.value} className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:border-[#2E86AB]">
                      <input
                        type="radio"
                        name="exchangeType"
                        value={type.value}
                        checked={formik.values.exchangeType === type.value}
                        onChange={formik.handleChange}
                        className="mr-3"
                      />
                      <span>{type.label}</span>
                    </label>
                  ))}
                </div>
                {formik.touched.exchangeType && formik.errors.exchangeType && (
                  <div className="text-red-600 text-sm mt-1">{formik.errors.exchangeType}</div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Time Rate (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    {...formik.getFieldProps('hourlyRate')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                  />
                  {formik.touched.hourlyRate && formik.errors.hourlyRate && (
                    <div className="text-red-600 text-sm mt-1">{formik.errors.hourlyRate}</div>
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">Service Duration (Hours)</label>
                  <input
                    type="number"
                    min="1"
                    {...formik.getFieldProps('duration')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                  />
                  {formik.touched.duration && formik.errors.duration && (
                    <div className="text-red-600 text-sm mt-1">{formik.errors.duration}</div>
                  )}
                </div>
              </div>

              {(formik.values.exchangeType === 'money' || formik.values.exchangeType === 'hybrid') && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Money Price (USD)</label>
                  <input
                    type="number"
                    min="1"
                    {...formik.getFieldProps('moneyPrice')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                    placeholder="Enter price in USD"
                  />
                  {formik.touched.moneyPrice && formik.errors.moneyPrice && (
                    <div className="text-red-600 text-sm mt-1">{formik.errors.moneyPrice}</div>
                  )}
                </div>
              )}

              {(formik.values.exchangeType === 'time' || formik.values.exchangeType === 'hybrid') && (
                <div>
                  <label className="block text-gray-700 font-medium mb-2">Suggested Services for Exchange</label>
                  <textarea
                    {...formik.getFieldProps('suggestedExchange')}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2E86AB]"
                    placeholder="e.g., Graphic design, content writing, social media management..."
                  />
                  {formik.touched.suggestedExchange && formik.errors.suggestedExchange && (
                    <div className="text-red-600 text-sm mt-1">{formik.errors.suggestedExchange}</div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Media Upload */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-[#2E86AB]">Media & Portfolio</h2>
            
            <div className="space-y-6">
              {/* Images */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Images (Max 5)</label>
                <div
                  {...getImageRootProps()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#2E86AB]"
                >
                  <input {...getImageInputProps()} />
                  <Upload className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-gray-600">Drop images here or click to upload</p>
                  <p className="text-sm text-gray-500">PNG, JPG, GIF up to 10MB each</p>
                </div>
                
                {images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                    {images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Videos */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">Videos (Max 2)</label>
                <div
                  {...getVideoRootProps()}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#2E86AB]"
                >
                  <input {...getVideoInputProps()} />
                  <Camera className="mx-auto mb-2 text-gray-400" size={24} />
                  <p className="text-gray-600">Drop videos here or click to upload</p>
                  <p className="text-sm text-gray-500">MP4, MOV, AVI up to 50MB each</p>
                </div>
                
                {videos.length > 0 && (
                  <div className="space-y-2 mt-4">
                    {videos.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-white p-3 rounded-lg">
                        <span className="text-sm truncate">{file.name}</span>
                        <button
                          type="button"
                          onClick={() => removeVideo(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActivePage('dashboard')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              leftIcon={<Plus size={18} />}
            >
              Create Service
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateServicePage;