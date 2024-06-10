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
    final PlaceMapper mapper;

    public void selectadd(Place place) {
        mapper.insert(place);
    }
}
