export const generateDescription = async (listingDetails) => {
  const response = await fetch('http://localhost:8080/api/ai/generate-description', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body: JSON.stringify({
      title: listingDetails.title,
      city: listingDetails.city,
      area: listingDetails.area,
      rent: listingDetails.rent,
      roomType: listingDetails.roomType,
      gender: listingDetails.gender,
      amenities: listingDetails.amenities.join(', ')
    })
  });

  const data = await response.json();
  if (data.error) throw new Error(data.error);
  return data.description;
};