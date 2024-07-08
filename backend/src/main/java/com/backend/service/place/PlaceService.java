package com.backend.service.place;

import com.backend.domain.place.Place;
import com.backend.mapper.place.PlaceMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(rollbackFor = Exception.class)
@RequiredArgsConstructor
public class PlaceService {

    private final PlaceMapper mapper;

    @Transactional
    public void addPlace(Place place) {
        String[] addressParts = place.getAddress().split(" ");
        String addressCountry = addressParts[0];
        String addressCity = addressParts[1];

        place.setAddressCountry(addressCountry);
        place.setAddressCity(addressCity);
        mapper.insert(place);
    }
}
