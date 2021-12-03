-- Function for updating tables with timestamp_update columns
CREATE OR REPLACE FUNCTION fnc_timestamp_update() RETURNS Trigger
LANGUAGE 'plpgsql'
AS $$
    BEGIN
        NEW.timestamp_update = NOW();
        RETURN NEW;
    END;
$$;